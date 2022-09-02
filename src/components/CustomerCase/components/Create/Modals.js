import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import React from 'react';

export const ErrorModal = ({ onToggle }) => {
  return (
    <Modal size="sm" containerClass="overflow-auto bg-secondary" onToggle={onToggle}>
      <div className="p-8">
        <ModalHeader onToggle={onToggle}>Something bad happen</ModalHeader>
        <p>Please try again.</p>
        <ModalFooter>
          <button className="ml-3 btn btn-outline">Close</button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

export const SuccessModal = ({ onToggle, title }) => {
  return (
    <Modal size="sm" containerClass="overflow-auto bg-secondary" onToggle={onToggle}>
      <div className="p-8">
        <ModalHeader onToggle={onToggle}>Customer Case Successfully Created</ModalHeader>
        <p>Your article, {title} has been submitted for review at SpeedFusion Marketplace.</p>
        <p>
          Thank you for your submission. Our team is working to review your article and will notify you once it is
          approved.
        </p>
        <ModalFooter>
          <button className="ml-3 btn btn-outline">Close</button>
        </ModalFooter>
      </div>
    </Modal>
  );
};
