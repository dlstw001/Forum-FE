import { Modal, ModalHeader } from 'components/common/Modal';
import Filters from '.';
import React from 'react';

export default ({ onToggleFilterModal, methods, onChangeInput, debouncedValue, onReset }) => {
  return (
    <>
      <Modal
        size="sm"
        containerClass="bg-secondary overflow-y-auto"
        className="lg:hidden"
        onToggle={onToggleFilterModal}
      >
        <div className="p-8">
          <ModalHeader onToggle={onToggleFilterModal}>Search Customer Cases</ModalHeader>
          <Filters methods={methods} onChangeInput={onChangeInput} searchDefaultValue={debouncedValue}>
            <div className="grid grid-cols-2 gap-4">
              <button className="btn btn-outline" type="button" onClick={onReset}>
                Reset
              </button>
              <button className="btn btn-outline" type="button" onClick={onToggleFilterModal}>
                View Results
              </button>
            </div>
          </Filters>
        </div>
      </Modal>
    </>
  );
};
