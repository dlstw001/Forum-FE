import { inject, observer } from 'mobx-react';
import { Modal, ModalHeader } from 'components/common/Modal';
import { useForm } from 'react-hook-form';
// import Client from './Client';
import Editor, { getContentToState, getStateToContent } from 'components/common/Form/Editor';
import ImageUpload from './ImageUpload';
import Input from 'components/common/Form/Input';
// import Partner from './components/Partner';
import { EditorState } from 'draft-js';
import { LOGIN_URL, ROUTES } from 'definitions';
import { useHistory } from 'react-router-dom';
import React from 'react';
import ReminderModal from 'components/common/modals/ReminderModal';
import Tags from './Tags';
import useToggle from 'hooks/useToggle';

const CaseModal = ({ caseStore, userStore, uploadStore, data, onToggle }) => {
  const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());
  const history = useHistory();
  const [file, setFile] = React.useState();
  const [contentData, setContentData] = React.useState();

  const methods = useForm();
  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitted },
  } = methods;

  const { toggle, handleToggle } = useToggle({ successModal: false, errorModal: false });

  React.useEffect(() => {
    if (!userStore.user) window.location.href = LOGIN_URL;
  }, [userStore.user]);

  React.useEffect(() => {
    if (data?.raw) setContentData(getContentToState(data.raw));
  }, [data]);

  React.useEffect(() => {
    if (data) {
      reset({ ...data, tags: data?.tags?.map((i) => ({ ...i, label: i?.name, value: i?.name })) });
      setFile(data.image);
    }
  }, [reset, data]);

  const showSuccessModal = () => {
    handleToggle({ successModal: true });
    setTimeout(() => {
      handleToggle({ successModal: false });
      onToggle();
    }, 5000);
  };

  const showErrorModal = () => {
    handleToggle({ errorModal: true });
    setTimeout(() => {
      handleToggle({ errorModal: false });
    }, 5000);
  };

  const handleUpload = (file, form, config) => {
    return uploadStore.uploadImage(form, config);
  };

  const onSave = async (props) => {
    const { ...rest } = props;
    const payload = {
      ...rest,
      image: file?.url,
      published: true,
    };

    if (data) {
      await caseStore
        .update({ ...payload, id: data._id })
        .then(async (res) => {
          await caseStore.get(res.item.slug);
          if (!res.item.hidden) history.push(`${ROUTES.CASES}/${res.item.slug}`);
          else showSuccessModal();
        })
        .catch(() => showErrorModal());
    } else {
      await caseStore
        .create(payload)
        .then(async (res) => {
          await caseStore.get(res.item.slug);
          if (!res.item.hidden) history.push(`${ROUTES.CASES}/${res.item.slug}`);
          else showSuccessModal();
        })
        .catch(() => showErrorModal());
    }
    onToggle();
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
    <>
      <Modal size="sm" containerClass="overflow-auto bg-secondary" onToggle={onToggle}>
        <form className="p-8" onSubmit={handleSubmit(onSave)}>
          <ModalHeader onToggle={onToggle}>Write a case study</ModalHeader>
          <div className="">
            <div className="mb-4 form-group">
              <ImageUpload
                methods={methods}
                defaultValue={file}
                onUpload={setFile}
                label="Featured Image"
                helperText={
                  <>
                    This image may appear on the front page.
                    <br /> Recommended size: 1440 x 1080 pixel
                  </>
                }
                data-cy="featured_image"
              />
            </div>
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
                defaultValue={contentData}
                options={{
                  onGetSuggestions: userStore.mention,
                  onUpload: handleUpload,
                }}
                rules={{ required: true }}
                data-cy="editor-body"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* <Client methods={methods} /> */}
              <Tags methods={methods} />
            </div>
            {/* <div className="my-6">
              <div className="group-modal-title">
                URL of Original Article <small className="lowercase">(if applicable)</small>
              </div>
              <Input className="mb-3" name="url" methods={methods} data-cy="customer_case_url" />
            </div> */}
          </div>
          <div className="flex justify-end my-6">
            <button onClick={() => onToggle()} className="btn btn-outline" data-cy="cancel_btn">
              Cancel
            </button>
            <button className="ml-3 btn btn-outline" data-cy="confirm_btn">
              Submit
            </button>
          </div>
        </form>
      </Modal>
      {toggle.successModal && (
        <ReminderModal
          onToggle={() => handleToggle({ showSuccessModal: false })}
          title={methods.getValues('title')}
          message={
            <>
              <p>
                Your article, {methods.getValues('title')} has been submitted for review at SpeedFusion Marketplace.
              </p>
              <p>
                Thank you for your submission. Our team is working to review your article and will notify you once it is
                approved.
              </p>
            </>
          }
          isOnlyOk
        />
      )}
      {toggle.errorModal && (
        <ReminderModal
          onToggle={() => handleToggle({ errorModal: false })}
          message={'Please try again later.'}
          isOnlyOk
        />
      )}
    </>
  );
};

export default inject(({ userStore, caseStore, uploadStore }) => ({
  userStore,
  caseStore,
  uploadStore,
}))(observer(CaseModal));
