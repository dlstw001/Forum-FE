import { Modal, ModalFooter, ModalHeader } from '../Modal';
import React from 'react';

export default ({ onToggle, isOnlyOk, title, message, onHandle }) => {
  return (
    <Modal size="sm" containerClass="bg-secondary p-6" onToggle={onToggle}>
      <ModalHeader onToggle={onToggle}>{title || 'Attention'}</ModalHeader>
      <div className="mb-4">{message}</div>
      {isOnlyOk ? (
        <ModalFooter>
          <button className="ml-3 btn btn-outline" onClick={() => onToggle()}>
            Ok
          </button>
        </ModalFooter>
      ) : (
        <ModalFooter>
          <button className="ml-3 btn btn-outline" onClick={() => onToggle()} data-cy="cancel_btn">
            No
          </button>
          <button className="ml-3 btn btn-outline" onClick={onHandle} data-cy="confirm_btn">
            Yes
          </button>
        </ModalFooter>
      )}
    </Modal>
  );
};
