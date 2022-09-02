import Modal from '../Modal/Modal';
import ModalFooter from '../Modal/ModalFooter';
import ModalHeader from '../Modal/ModalHeader';
import React from 'react';

const PublicIPModal = ({ data, onToggle, onSubmit }) => {
  return (
    <Modal size="sm" containerClass="bg-secondary p-6">
      <ModalHeader>Attention</ModalHeader>
      <div className="mb-4">
        Public {data.length > 1 ? 'IPs' : 'IP'} detected. <pre>{data?.map((i) => i.originalIp).join('\n')}</pre> Are you
        sure you want to post it?
      </div>

      <ModalFooter>
        <button className="ml-3 btn btn-outline" onClick={onToggle}>
          Cancel
        </button>
        <button className="ml-3 btn btn-outline" onClick={() => onSubmit(data)}>
          Proceed
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default PublicIPModal;
