import { inject, observer } from 'mobx-react';
import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import { useForm } from 'react-hook-form';
import Input from 'components/common/Form/Input';
import React from 'react';

const SendInviteModal = ({ onToggle }) => {
  const methods = useForm({
    defaultValues: {
      category: null,
      tags: null,
    },
  });

  const { handleSubmit } = methods;

  const onSave = async () => {
    onToggle(false);
  };

  return (
    <Modal size="sm" containerClass="bg-secondary" onToggle={onToggle}>
      <form className="p-8" onSubmit={handleSubmit(onSave)}>
        <ModalHeader onToggle={onToggle}>Send an invite</ModalHeader>
        <div className="mb-4">
          <div className="group-modal-title">
            Enter the username of the person you'd like to invite to this topic <sup>*</sup>
          </div>
          <Input name="email" className="mb-3" methods={methods} rules={{ required: true }} />
        </div>
        <ModalFooter>
          <button onClick={() => onToggle()} className="btn btn-outline">
            Cancel
          </button>
          <button className="ml-3 btn btn-outline">Submit</button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default inject(({ reviewStore }) => ({ reviewStore }))(observer(SendInviteModal));
