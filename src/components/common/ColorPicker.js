import { Modal, ModalFooter } from './Modal';
import { SketchPicker } from 'react-color';
import React from 'react';

export default ({ color, initialColor, setInitialColor, onChange, onToggle }) => {
  return (
    <Modal size="sm" containerClass="bg-secondary" onToggle={onToggle}>
      <div className="p-8">
        <SketchPicker
          className="color-picker"
          width="auto"
          color={color}
          onChangeComplete={({ hex }) => onChange(hex)}
        />

        <ModalFooter>
          <button
            onClick={() => {
              onChange(initialColor);
              onToggle();
            }}
            className="btn btn-outline"
            data-cy="cancel_color_btn"
          >
            Cancel
          </button>
          <button
            className="ml-3 btn btn-outline"
            onClick={() => {
              setInitialColor(color);
              onToggle();
            }}
            data-cy="confirm_color_btn"
          >
            Confirm
          </button>
        </ModalFooter>
      </div>
    </Modal>
  );
};
