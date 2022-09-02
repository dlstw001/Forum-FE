import { checkForPublicIP, colorHex, getTopicUrl } from 'utils';
import { ContentState } from 'draft-js';
import { debounce, isEmpty } from 'lodash-es';
import { EditorState } from 'draft-js';
import { includes, isEqual, omit, trim } from 'lodash';
import { inject, observer } from 'mobx-react';
import { LOGIN_URL } from 'definitions';
import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import { useForm } from 'react-hook-form';
import { useRouteMatch } from 'react-router-dom';
import CreatableSelect from '../Form/CreatableSelect';
import Editor, { getStateToContent } from '../Form/Editor';
import Input from '../Form/Input';
import Loading from '../Loading';
import PublicIPModal from './PublicIPModal';
import React from 'react';
import Select from '../Form/Select';
import useToggle from 'hooks/useToggle';

const TopicModal = ({
  defaultCategorySlug,
  tagStore,
  draftStore,
  postStore,
  userStore,
  categoryStore,
  uploadStore,
  onToggle,
  data: _data,
  draft: _draft,
  type,
  onCleanup,
  onDiscardDraft,
}) => {
  const methods = useForm({
    defaultValues: {
      category: null,
      raw: '',
      tags: null,
      title: '',
      ..._data,
    },
  });
  const { params } = useRouteMatch();
  const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());
  const {
    reset,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { isSubmitted, isDirty },
  } = methods;
  const { title, category, tags, raw } = watch();
  // const draft = React.useRef(_draft);
  const [draft, setDraft] = React.useState();
  const cancelSaveDraftRef = React.useRef();
  const [serverErrors, setServerErrors] = React.useState([]);
  const { handleToggle, toggle } = useToggle({
    hiddenInfoModal: false,
    isLoading: false,
  });
  const data = React.useMemo(() => {
    return _data || null;
  }, [_data]);

  React.useEffect(() => {
    setDraft(_draft);
  }, [_draft]);

  React.useEffect(() => {
    if (!userStore.user) window.location.href = LOGIN_URL;
  }, [userStore.user]);

  React.useEffect(() => {
    if (!isEmpty(data)) {
      setEditorState(EditorState.createWithContent(ContentState.createFromText(data?.raw || data?.content)));
    }
  }, [data]);

  React.useEffect(() => {
    if (data) {
      reset({ ...data, tags: data?.tags?.map((i) => ({ ...i, label: i?.name, value: i?.name })) });
    }
  }, [reset, data, tagStore, type]);

  React.useEffect(() => {
    if (defaultCategorySlug) {
      reset({
        category: categoryStore.items.data.find((i) => i.slug === defaultCategorySlug),
      });
    }
  }, [defaultCategorySlug, categoryStore.items.data, setValue, reset, getValues]);

  React.useEffect(() => {
    tagStore.find({ limit: 1000 });
  }, [tagStore]);

  const tagsOptions = React.useMemo(() => {
    const tags = tagStore.items.data
      .map((item) => omit(item, 'count'))
      .map((item) => ({ ...item, label: item.name, value: item.name }));
    const banned_tags = category?.banned_tags?.map((item) => item._id) || [];

    return tags.filter((item) => !includes(banned_tags, item._id));
  }, [category, tagStore.items.data]);

  React.useEffect(() => {
    categoryStore.find({ limit: 1000 });
  }, [categoryStore]);

  const createTag = async (val) => {
    const values = getValues();
    await tagStore
      .create({ name: val })
      .then(
        async ({ item }) => await reset({ ...values, tags: [{ ...item, label: item.name, value: item.name }, ...tags] })
      );
  };

  const getPublicIps = React.useMemo(() => {
    const raw = watch('raw');
    return checkForPublicIP(raw);
  }, [watch]);

  const checkBeforeSubmit = (props) => {
    if (getPublicIps) {
      handleToggle({ publicIPModal: true });
    } else {
      onSave(props);
    }
  };

  const onSave = async (props) => {
    const { category, tags, ...rest } = props;
    const payload = { ...rest, category: category?._id, tags: tags?.map((i) => i?._id), published: true };
    let res;
    handleToggle({ isLoading: true });
    cancelSaveDraftRef.current = true;

    try {
      const id = data?.post?._id || data?._id;
      const isUpdate = data?.published || data?.post?._id;
      res = isUpdate ? await postStore.update({ ...payload, id }) : await postStore.create(payload);
      if (draft) {
        await draftStore.delete(draft._id);
        setDraft(null);
      }

      if (!res.item.hidden) {
        onCleanup(!isUpdate && getTopicUrl(res.item));
      } else {
        handleToggle({ hiddenInfoModal: !toggle.hiddenInfoModal });
      }
    } catch (e) {
      setServerErrors(e.response.data.errors);
    } finally {
      handleToggle({ isLoading: false });
    }
  };

  const handleSaveDraft = React.useCallback(async () => {
    if (cancelSaveDraftRef.current) return false;
    const form = getValues();
    Object.keys(form).map((i) => (form[i] = form[i] && trim(form[i])));
    const isEmpty = Object.values(form).every((x) => x === null || x === '');

    const payload = {
      ...form,
      category: category?._id,
      tags: tags?.map((i) => i?._id),
      ...(_data && { post: params.id }),
      isPost: true,
    };

    let res;
    if (!isEmpty) {
      if (draft) {
        res = await draftStore.update({ ...payload, id: draft._id });
      } else {
        res = await draftStore.create(payload);
        reset({ ...res.item, tags });
        setDraft(res.item);
      }
    }
  }, [_data, category, draft, draftStore, getValues, params.id, reset, tags]);

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
  }, [category, debounced, handleToggle, isDirty, raw, tags, title]);

  const handleUpload = (file, form, config) => {
    return uploadStore.uploadImage(form, config);
  };

  const onCancel = () => {
    cancelSaveDraftRef.current = true;
    // if (draft.current && isDirty && !data) {
    //   handleToggle({ cancelInfoModal: !toggle.cancelInfoModal });
    // } else {
    onToggle(false);
    // }
  };

  // const handleChange = React.useCallback(
  //   (e) => {
  //     setEditorState(e);
  //     const value = getStateToContent(e);
  //     setValue('raw', value, { shouldValidate: isSubmitted });
  //   },
  //   [isSubmitted, setValue]
  // );

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

  return (
    <Modal size="full" containerClass="bg-secondary" className="relative topic-modal">
      <form className="p-8" onSubmit={handleSubmit(checkBeforeSubmit)}>
        <ModalHeader onToggle={onToggle}>{_data ? 'Edit ' : 'Write a'} Topic</ModalHeader>
        <div className="">
          <div className="mb-4 form-group">
            <div className="group-modal-title">
              Title <sup>*</sup>
            </div>
            <Input className="mb-3" name="title" methods={methods} rules={{ required: true }} data-cy="topic_title" />
            <div className="mb-0 group-modal-title">
              Topic <sup>*</sup>
            </div>
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
          <div className="my-6 grid grid-cols-2 gap-x-4">
            <div>
              <div className="mb-0 group-modal-title">
                Category <sup>*</sup>
              </div>
              <Select
                name="category"
                methods={methods}
                options={categoryStore.items.data.filter((i) => i.canPost)}
                rules={{ required: true }}
                getOptionLabel={(value) => (
                  <div className="flex items-center">
                    {value.parent && (
                      <>
                        {value.read_restricted && <i className="material-icons md-12 archived">lock</i>}
                        <span className="w-3 h-3 mr-2" style={{ backgroundColor: colorHex(value.parent.color) }} />
                        <span className="mr-4">{value.parent.name}</span>
                      </>
                    )}
                    {value.read_restricted && <i className="material-icons md-12 archived">lock</i>}
                    <span className="w-3 h-3 mr-2" style={{ backgroundColor: colorHex(value.color) }} />
                    <span className="mr-4">{value.name}</span>
                  </div>
                )}
                getOptionValue={(value) => value.name}
                data-cy="select_category"
              />
            </div>
            {userStore.IS_ADMIN_OR_MODERATOR && (
              <div>
                <div className="mb-0 group-modal-title">Tags</div>

                <CreatableSelect
                  name="tags"
                  methods={methods}
                  isMulti
                  options={tagsOptions}
                  onCreateOption={createTag}
                  data-cy="select_tags"
                />
              </div>
            )}
          </div>
        </div>
        <ModalFooter className="justify-between">
          {draft && data && (
            <button
              title="Discard draft"
              type="button"
              className="btn btn-icon"
              onClick={() => onDiscardDraft(draft._id)}
            >
              <i className="text-black material-icons-outlined">delete</i>
            </button>
          )}
          <div className="ml-auto">
            <button
              type="button"
              disabled={toggle.isLoading}
              onClick={onCancel}
              className="btn btn-outline"
              data-cy="cancel_btn"
            >
              Cancel
            </button>
            <button
              disabled={!draft && (!isDirty || toggle.isLoading)}
              className="ml-3 btn btn-outline"
              data-cy="confirm_btn"
            >
              Submit
            </button>
          </div>
        </ModalFooter>
        {!!serverErrors.length && (
          <div className="flex items-center text-danger">
            <i className="ml-auto text-lg material-icons">error_outline</i>
            {serverErrors.map((i) => i.message.charAt(0).toUpperCase() + i.message.slice(1))}
          </div>
        )}
      </form>
      {toggle.isLoading && <Loading className="absolute top-0 z-auto w-full h-full" />}

      {/* {toggle.cancelInfoModal && (
        <ReminderModal
          onToggle={() => {
            handleToggle({ cancelInfoModal: !toggle.cancelInfoModal });
            onToggle();
          }}
          title="Friendly reminder"
          message="Would you like to discard this draft?"
          onHandle={handleDiscardDraft}
        />
      )} */}

      {toggle.publicIPModal && (
        <PublicIPModal
          data={getPublicIps}
          onToggle={() => handleToggle({ publicIPModal: false })}
          onSubmit={() => onSave(getValues())}
        />
      )}

      {toggle.hiddenInfoModal && (
        <Modal size="sm" containerClass="bg-secondary p-6">
          <ModalHeader>Attention</ModalHeader>
          <div className="mb-4">Your topic is under review by our moderators. Please wait.</div>

          <ModalFooter>
            <button className="ml-3 btn btn-outline" onClick={() => onToggle(false)}>
              Ok
            </button>
          </ModalFooter>
        </Modal>
      )}
    </Modal>
  );
};

export default inject(({ tagStore, postStore, categoryStore, userStore, draftStore, uploadStore }) => ({
  tagStore,
  postStore,
  categoryStore,
  userStore,
  draftStore,
  uploadStore,
}))(observer(TopicModal));
