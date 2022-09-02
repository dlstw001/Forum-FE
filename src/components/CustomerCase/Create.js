import { Converter } from 'showdown';
import { ErrorModal, SuccessModal } from './components/Create/Modals';
import { inject, observer } from 'mobx-react';
import { Modal, ModalHeader } from 'components/common/Modal';
import { useForm } from 'react-hook-form';
import Client from './components/Create/Client';
import Editor, { getStateToContent } from 'components/common/Form/Editor';
import ImageUpload from './components/Create/ImageUpload';
import Input from 'components/common/Form/Input';
// import Partner from './components/Partner';
import { EditorState } from 'draft-js';
import React from 'react';
import Tags from './components/Create/Tags';
import useToggle from 'hooks/useToggle';

const CreateCustomerCaseModal = ({ onToggle, customerCaseStore }) => {
  const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());

  const { toggle, handleToggle } = useToggle({
    successModal: false,
    errorModal: false,
  });

  const methods = useForm({
    defaultValues: {
      category: null,
      tags: null,
    },
  });

  const converter = new Converter({
    tables: true,
    strikethrough: true,
    simpleLineBreaks: true,
  });

  const [featuredImageData, setFeaturedImageData] = React.useState({});
  const {
    handleSubmit,
    setValue,
    formState: { isSubmitted },
  } = methods;

  const onSave = (data) => {
    const { tags, client, url, raw, ...rest } = data;

    const payload = {
      ...rest,
      content: converter.makeHtml(raw),
      client: client.value || client.id,
      tags: tags.id,
      featured_media: featuredImageData.id,
      'wpcf-original-article-url': url,
    };

    customerCaseStore.create(payload).then(showSuccessModal).catch(showErrorModal);
  };

  const showSuccessModal = () => {
    handleToggle({
      successModal: true,
    });

    setTimeout(() => {
      handleToggle({ successModal: false });
      onToggle();
    }, 5000);
  };

  const showErrorModal = () => {
    handleToggle({
      errorModal: true,
    });

    setTimeout(() => {
      handleToggle({ errorModal: false });
    }, 5000);
  };

  const handleUpload = async (file) => {
    let response;
    const formData = new FormData();

    formData.append('image', file);
    response = await customerCaseStore.uploadMedia(formData);

    return { url: response?.source_url };
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
            <ImageUpload
              methods={methods}
              onUpload={setFeaturedImageData}
              label="Featured Image"
              helperText={
                <>
                  This image may appear on the front page.
                  <br /> Recommended size: 1440 x 1080 pixel
                </>
              }
              required
              data-cy="featured_image"
            />
            <div className="my-6">
              <div className="group-modal-title">
                Name of the article <sup>*</sup>
              </div>
              <Input
                className="mb-3"
                name="title"
                methods={methods}
                rules={{ required: true }}
                data-cy="customer_case_name"
              />
            </div>

            <div className="my-6 form-group">
              <div className="mb-0 form-label">Content</div>
              <div className="form-helper">
                Please note that the first 30 words will be appeared as brief description of the article.
              </div>
              <Editor
                name="raw"
                className="activated"
                methods={methods}
                onChange={handleChange}
                editorState={editorState}
                rules={{ required: true }}
                options={{
                  onUpload: handleUpload,
                }}
                data-cy="customer_case_content"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Client methods={methods} />
              <Tags methods={methods} />
            </div>
            <div className="my-6">
              <div className="group-modal-title">
                URL of Original Article <small className="lowercase">(if applicable)</small>
              </div>
              <Input className="mb-3" name="url" methods={methods} data-cy="customer_case_url" />
            </div>
          </div>
          <div className="flex justify-end my-6">
            <button onClick={() => onToggle()} className="btn btn-outline" data-cy="cancel_btn">
              Cancel
            </button>
            <button className="ml-3 btn btn-outline" data-cy="confirm_btn">
              Create
            </button>
          </div>
        </form>
      </Modal>
      {toggle.successModal && (
        <SuccessModal onToggle={() => handleToggle({ showSuccessModal: false })} title={methods.getValues('title')} />
      )}
      {toggle.errorModal && <ErrorModal onToggle={() => handleToggle({ errorModal: false })} />}
    </>
  );
};

export default inject(({ userStore, customerCaseStore }) => ({
  userStore,
  customerCaseStore,
}))(observer(CreateCustomerCaseModal));
