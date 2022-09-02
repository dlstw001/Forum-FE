import { ARCHETYPE } from '../ReplyForm';
import { ContentState } from 'draft-js';
import { debounce, isEqual } from 'lodash-es';
import { EditorState } from 'draft-js';
import { getMessageUrl, getTopicUrl } from 'utils';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import { ROUTES } from 'definitions';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Editor, { getStateToContent } from '../Form/Editor';
import React from 'react';

const CreateReplyModal = ({
  draftStore,
  replyStore,
  messageStore,
  uploadStore,
  userStore,
  onToggle,
  data,
  onSuccess,
}) => {
  const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());
  const history = useHistory();
  const methods = useForm({
    defaultValues: {
      ...data,
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { isSubmitted },
  } = methods;
  const [isDirty, setIsDirty] = React.useState(false);
  const cancelSaveDraftRef = React.useRef();

  const { raw } = watch();

  React.useEffect(() => {
    if (data) {
      setIsDirty(!isEqual({ raw }, { raw: data?.raw }));
    }
  }, [data, raw]);

  React.useEffect(() => {
    setEditorState(EditorState.createWithContent(ContentState.createFromText(data.raw || data.content)));
  }, [data.content, data.raw]);

  const onSave = async ({ ...rest }) => {
    const payload = { ...data, ...rest, published: true };
    let method = replyStore.create;
    let urlGenerator = getTopicUrl;
    if (ARCHETYPE.PRIVATE_MESSAGE === data.archetype) {
      method = messageStore.createReply;
      urlGenerator = getMessageUrl;
    }
    cancelSaveDraftRef.current = true;
    await method(data.post._id, payload);
    await draftStore.delete(data._id);

    history.push(urlGenerator(data.post));
    onToggle(false);
    onSuccess();
  };

  const handleSaveDraft = React.useCallback(async () => {
    if (cancelSaveDraftRef.current) return false;
    const payload = {
      ...getValues(),
    };
    await draftStore.update({ ...payload, id: data._id });
  }, [data._id, draftStore, getValues]);

  const debounced = React.useMemo(
    () =>
      debounce(() => {
        handleSaveDraft();
      }, 1000),
    [handleSaveDraft]
  );

  React.useEffect(() => {
    if (isDirty) {
      debounced();
    }
  }, [debounced, isDirty, raw]);

  const handleUpload = (file, form, config) => {
    return uploadStore.uploadImage(form, config);
  };
  const handleChange = React.useCallback(
    (e) => {
      setEditorState(e);
      const value = getStateToContent(e);
      setValue('raw', value, { shouldValidate: isSubmitted });
    },
    [isSubmitted, setValue]
  );

  const handleCancel = () => {
    cancelSaveDraftRef.current = true;
    onToggle();
  };

  return (
    <Modal size="lg" containerClass="bg-secondary" onToggle={onToggle}>
      <form className="p-8" onSubmit={handleSubmit(onSave)}>
        <ModalHeader onToggle={onToggle}>
          <Link to={`${ROUTES.TOPIC}/${data?.post?._id}`} data-cy="header_modal">
            {data ? 'Edit ' : 'Write a'} reply to a topic {data?.post?.title}
          </Link>
        </ModalHeader>
        <div className="mb-4 form-group">
          <div className="group-modal-title">Reply</div>
          <Editor
            name="raw"
            className="activated"
            methods={methods}
            onChange={handleChange}
            editorState={editorState}
            options={{
              onGetSuggestions: userStore.mention,
              onUpload: handleUpload,
            }}
            rules={{ required: true }}
            data-cy="editor-body"
          />
        </div>
        <ModalFooter>
          <button type="button" onClick={handleCancel} className="btn btn-outline">
            Cancel
          </button>
          <button disabled={!raw} type="submit" className="ml-3 btn btn-outline">
            Submit
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default inject(({ draftStore, replyStore, uploadStore, userStore, messageStore }) => ({
  draftStore,
  replyStore,
  uploadStore,
  userStore,
  messageStore,
}))(observer(CreateReplyModal));
