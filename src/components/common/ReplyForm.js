import { checkForPublicIP } from 'utils';
import { ContentState } from 'draft-js';
import { debounce, isEqual } from 'lodash-es';
import { EditorState } from 'draft-js';
import { inject, observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import { Modifier } from 'draft-js';
import { useForm } from 'react-hook-form';
import cx from 'classnames';
import Editor, { getStateToContent } from 'components/common/Form/Editor';
import Errors from 'components/common/Errors';
import PublicIPModal from './modals/PublicIPModal';
import React from 'react';
import useToggle from 'hooks/useToggle';

export const ARCHETYPE = { REGULAR: 'regular', PRIVATE_MESSAGE: 'private_message', CASE: 'case' };
const Form = ({
  replyObject = {},
  onSubmit,
  placeholder,
  draftStore,
  userStore,
  uploadStore,
  onToggle,
  isWhisper = false,
  isExpanded,
  draft: _draft,
  postId,
  onCleanup,
  onDiscardDraft,
  archetype = ARCHETYPE.REGULAR,
}) => {
  const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());
  const [errors, setErrors] = React.useState();
  const [isReady, setIsReady] = React.useState();
  const cancelSaveDraftRef = React.useRef();
  const [draft, setDraft] = React.useState(_draft);
  const [quote, setQuote] = React.useState();
  const { handleToggle, toggle } = useToggle({
    isLoading: false,
    whisper: isWhisper,
  });

  const methods = useForm();

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { isSubmitted, isDirty },
  } = methods;
  const { raw } = watch();

  const content = React.useMemo(() => {
    return replyObject.content;
  }, [replyObject.content]);

  React.useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    });
  }, []);

  React.useEffect(() => {
    setDraft(_draft);
  }, [_draft]);

  const mode = React.useMemo(() => {
    return replyObject.mode;
  }, [replyObject.mode]);

  const isDraft = React.useMemo(() => {
    return replyObject.draft;
  }, [replyObject.draft]);

  const data = React.useMemo(() => {
    return replyObject.data || {};
  }, [replyObject.data]);

  const link = React.useMemo(() => {
    return replyObject.link;
  }, [replyObject.link]);

  React.useEffect(() => {
    if (!isEmpty(content) && mode !== 'quote') {
      setEditorState(
        EditorState.createWithContent(ContentState.createFromText(mode === 'reply' && !isDraft ? '' : content))
      );
    }
  }, [content, isDraft, mode]);

  React.useEffect(() => {
    if (mode === 'quote') {
      setQuote(content);
    }
  }, [content, replyObject.counter, mode]);

  // React.useEffect(() => {
  //   if (isSubmitSuccessful) {
  //     console.log('isSubmitSuccessful');

  //     reset({ content: '' });
  //   }
  // }, [isSubmitSuccessful, reset]);

  const handleChange = React.useCallback(
    (e) => {
      setEditorState((prevState) => {
        const value = getStateToContent(e);
        setValue('raw', value, {
          shouldValidate: isSubmitted,
          shouldDirty: value && !isEqual(getStateToContent(prevState), value),
        });
        return e;
      });
    },
    [isSubmitted, setValue]
  );

  React.useEffect(() => {
    if (quote) {
      const blockMap = ContentState.createFromText(quote).blockMap;

      const newState = Modifier.replaceWithFragment(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        blockMap
      );
      const newEditorState = EditorState.push(editorState, newState, 'insert-fragment');
      handleChange(newEditorState);

      onToggle(true);
      setQuote(null);
    }
  }, [editorState, handleChange, onToggle, quote]);

  const getPublicIps = React.useMemo(() => {
    return checkForPublicIP(raw);
  }, [raw]);

  const checkBeforeSubmit = (props) => {
    if (getPublicIps) {
      handleToggle({ publicIPModal: true });
    } else {
      onSave(props);
    }
  };

  const onSave = React.useCallback(
    (_data) => {
      cancelSaveDraftRef.current = true;
      handleToggle({ isLoading: true });
      setErrors(null);
      onSubmit({ ..._data, ...(toggle.whisper && { whisper: true }) }, mode)
        .then((res) => {
          setEditorState(EditorState.createWithContent(ContentState.createFromText('')));
          if (draft) {
            draftStore.delete(draft._id);
          }
          onCleanup(res);
        })
        .catch((err) => {
          setErrors(err.data.errors);
        })
        .finally(() => {
          handleToggle({ isLoading: false });
        });
    },
    [draft, draftStore, handleToggle, mode, onCleanup, onSubmit, toggle.whisper]
  );

  const handleSaveDraft = React.useCallback(async () => {
    if (cancelSaveDraftRef.current) return false;
    if (!isEmpty(replyObject)) {
      const { data: { _id, post } = {}, ...rest } = replyObject;
      const payload = {
        ...getValues(),
        post: post ? post._id : _id,
        archetype,
        ...rest,
      };
      let res;
      if (draft) {
        res = await draftStore.update({ ...payload, id: draft._id });
      } else {
        res = await draftStore.create(payload);
        reset(res.item);
        setDraft(res.item);
      }
    }
  }, [archetype, draft, draftStore, getValues, replyObject, reset]);

  const debounced = React.useMemo(
    () =>
      debounce(() => {
        handleSaveDraft();
      }, 3000),
    [handleSaveDraft]
  );

  React.useEffect(() => {
    if (isDirty && raw) {
      debounced();
    }
  }, [debounced, isDirty, raw]);

  const handleUpload = (file, form, config) => {
    return uploadStore.uploadImage(form, config);
  };

  const handleCancel = () => {
    cancelSaveDraftRef.current = true;
    onToggle();
  };

  return (
    <>
      <div className="flex mb-2 word-break">{link}</div>
      <form onSubmit={handleSubmit(checkBeforeSubmit)}>
        <Errors errors={errors} />
        {isReady && (
          <Editor
            className={cx({ expanded: isExpanded })}
            name="raw"
            methods={methods}
            onChange={handleChange}
            editorState={editorState}
            options={{
              placeholder,
              postId,
              onGetSuggestions: userStore.mention,
              ...(userStore.IS_ADMIN_OR_MODERATOR && data.archetype !== 'private_message' //TODO: convert to type ENUM
                ? { onToggleWhisper: () => handleToggle({ whisper: !toggle.whisper }) }
                : {}),

              onUpload: handleUpload,
            }}
            rules={{
              required: true,
            }}
            data-cy="reply-editor-body"
            state={{ whisper: toggle.whisper }}
          />
        )}
        <div className="flex font-bold uppercase">
          {draft && (
            <button
              type="button"
              className="btn btn-icon"
              onClick={() => onDiscardDraft(draft._id, replyObject)}
              title="Discard draft"
            >
              <i className="text-black material-icons">delete</i>
            </button>
          )}
          <div className="ml-auto">
            {(mode !== undefined || (raw !== '<p><br></p>' && raw !== '' && raw !== undefined)) && (
              <button onClick={handleCancel} className="btn" type="button">
                Cancel
              </button>
            )}

            {toggle.whisper ? (
              <button disabled={toggle.isLoading} className="ml-2 btn" type="submit">
                Whisper
              </button>
            ) : (
              <button
                disabled={toggle.isLoading}
                className="ml-2 btn"
                type="submit"
                data-key={'create_reply'}
                data-cy={mode === 'edit' ? 'update_reply' : 'create_reply'}
              >
                {mode === 'edit' ? 'Update' : 'Reply'}
              </button>
            )}
          </div>
        </div>
      </form>
      {toggle.publicIPModal && (
        <PublicIPModal
          data={getPublicIps}
          onToggle={() => handleToggle({ publicIPModal: false })}
          onSubmit={() => onSave(getValues())}
        />
      )}
    </>
  );
};

export default inject(({ draftStore, editorStore, userStore, uploadStore }) => ({
  draftStore,
  editorStore,
  userStore,
  uploadStore,
}))(observer(Form));
