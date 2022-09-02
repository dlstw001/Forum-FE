import { imageUploader } from 'utils';

import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import React from 'react';
import UploaderProgress from 'components/common/UploaderProgress';

export default ({ onToggle, onUpload, onSubmit }) => {
  const [files, setFiles] = React.useState([]);

  const handleUpload = async (files) => {
    const response = await imageUploader(files, onUpload);
    setFiles((prevState) => [...prevState, ...response]);
  };

  return (
    <Modal size="sm" containerClass="bg-secondary" onToggle={onToggle}>
      <div className="p-6">
        <ModalHeader onToggle={onToggle}>Upload Image</ModalHeader>
        <div className="mb-4">
          <UploaderProgress onUpload={handleUpload} onError={() => {}} description="" />
        </div>
        <ModalFooter>
          <button onClick={onToggle} className="btn btn-outline">
            Close
          </button>
          <button disabled={!files.length} onClick={() => onSubmit(files)} className="ml-3 btn btn-outline btn-primary">
            Insert
          </button>
        </ModalFooter>
      </div>
    </Modal>
  );
};
