import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import React from 'react';

export default ({ onToggle }) => {
  const onSubmit = () => {
    let FORUM = localStorage.getItem(process.env.REACT_APP_APP_NAME);
    const data = JSON.parse(FORUM);
    localStorage.setItem(process.env.REACT_APP_APP_NAME, JSON.stringify({ ...data, isNew: 'false' }));
    onToggle(false);
  };

  return (
    <Modal size="sm" containerClass="overflow-auto bg-secondary" onToggle={onToggle}>
      <div className="p-8">
        <ModalHeader onToggle={onToggle}>Greetings!</ModalHeader>
        <div className="mb-4">
          <p>Hi there!</p>
          <p>
            Welcome to the Peplink Community! Whether you joined to ask questions, find answers or make new discoveries,
            the friendly Peplink team and community members are here to help.
          </p>
          <p>We look forward to seeing you active in the Peplink Community.</p>
        </div>
        <ModalFooter>
          <button className="ml-3 btn btn-outline" onClick={onSubmit}>
            OK
          </button>
        </ModalFooter>
      </div>
    </Modal>
  );
};
