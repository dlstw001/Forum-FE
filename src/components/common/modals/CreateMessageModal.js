import { debounce } from 'lodash';
import { EditorState } from 'draft-js';
import { inject, observer } from 'mobx-react';
import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';
import AsyncSelect from 'components/common/Form/AsyncSelect';
import Editor, { getStateToContent } from 'components/common/Form/Editor';
import Input from 'components/common/Form/Input';
import Loading from '../Loading';
import React from 'react';
import useToggle from 'hooks/useToggle';

const CreateMessageModal = ({ userStore, messageStore, uploadStore, onToggle, toUser, callBack = () => {} }) => {
  const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());
  const methods = useForm();
  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitted },
  } = methods;
  const { target_users, title, raw } = watch();
  const { toggle, handleToggle } = useToggle({
    isLoading: false,
  });

  const loadOptions = debounce((keyword, callback) => {
    if (keyword) {
      userStore.mention({ keyword }).then((res) => {
        callback(res);
      });
    } else {
      callback([]);
    }
  }, 300);

  React.useEffect(() => {
    if (toUser)
      userStore.get(toUser).then((res) => {
        reset({
          target_users: [res.item],
        });
      });
  }, [userStore, toUser, reset]);

  const onSave = async ({ target_users, ...rest }) => {
    const payload = {
      ...rest,
      target_users: target_users?.map((i) => ({ user: i._id })),
      is_warning: false,
    };
    handleToggle({ isLoading: true });
    messageStore
      .post(payload)
      .then(() => {
        onToggle(false);
        if (callBack) {
          callBack();
        }
      })
      .finally(() => {
        handleToggle({ isLoading: false });
      });
  };

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

  return (
    <Modal size="lg" containerClass="overflow-auto bg-secondary">
      <form className="p-8" onSubmit={handleSubmit(onSave)}>
        <ModalHeader onToggle={onToggle}>Start a message</ModalHeader>
        <div className="">
          <div className="mb-4 form-group">
            <div className="group-modal-title">
              To <sup>*</sup>
            </div>
            <AsyncSelect
              name="target_users"
              methods={methods}
              rules={{ required: true }}
              cacheOptions
              defaultOptions
              loadOptions={loadOptions}
              getOptionLabel={(option) => option.displayName}
              getOptionValue={(option) => option._id}
              components={{ DropdownIndicator: null }}
              placeholder="Please select"
              isClearable={true}
              data-cy="target_users"
              isMulti
            />
            <div className="group-modal-title">
              Title <sup>*</sup>
            </div>
            <Input className="mb-3" name="title" methods={methods} rules={{ required: true }} data-cy="title" />
            <div className="group-modal-title">
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
        </div>
        <ModalFooter>
          <button onClick={() => onToggle()} className="btn btn-outline" data-cy="cancel_btn">
            Cancel
          </button>
          <button
            disabled={!(target_users && title && raw) || toggle.isLoading}
            className="ml-3 btn btn-outline"
            data-cy="create_btn"
          >
            Submit
          </button>
        </ModalFooter>
      </form>
      {toggle.isLoading && <Loading className="absolute top-0 z-auto w-full h-full" />}
    </Modal>
  );
};

export default inject(({ userStore, messageStore, uploadStore }) => ({
  userStore,
  messageStore,
  uploadStore,
}))(withRouter(observer(CreateMessageModal)));
