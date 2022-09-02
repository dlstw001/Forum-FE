import { inject, observer } from 'mobx-react';
import { Modal, ModalFooter, ModalHeader } from '../Modal';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';
import Input from '../Form/Input';
import React from 'react';

const CreateTagModal = ({ tagStore, onToggle, onSuccess }) => {
  const methods = useForm();
  const { handleSubmit, watch } = methods;
  const { name } = watch();
  const [serverErrors, setServerErrors] = React.useState([]);

  const onSave = async ({ ...rest }) => {
    const payload = { ...rest };

    await tagStore
      .create({ ...payload })
      .then(() => {
        onToggle(false);
        onSuccess();
      })
      .catch((e) => setServerErrors(e.response.data.errors));
  };

  return (
    <Modal size="sm" containerClass="overflow-auto bg-secondary" onToggle={onToggle}>
      <form className="p-8" onSubmit={handleSubmit(onSave)}>
        <ModalHeader onToggle={onToggle}>Create a Tag</ModalHeader>
        <div className="">
          <div className="mb-4 form-group">
            <div className="group-modal-title">
              Title <sup>*</sup>
            </div>
            <Input className="mb-3" name="name" methods={methods} rules={{ required: true }} data-cy="tag_title" />
          </div>
        </div>
        <ModalFooter>
          <button onClick={() => onToggle()} className="btn btn-outline" data-cy="cancel_btn">
            Cancel
          </button>
          <button disabled={!name} className="ml-3 btn btn-outline" data-cy="confirm_btn">
            Submit
          </button>
        </ModalFooter>
        {!!serverErrors.length && (
          <div className="flex items-center text-danger">
            <i className="ml-auto text-lg material-icons">error_outline</i>
            {serverErrors.map((i) => i.message.charAt(0).toUpperCase() + i.message.slice(1))}
          </div>
        )}
      </form>
    </Modal>
  );
};

export default inject(({ tagStore }) => ({ tagStore }))(withRouter(observer(CreateTagModal)));
