import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import { useForm } from 'react-hook-form';

import Input from '../../Input';
import React from 'react';

export default ({ onToggle, onSubmit, selectedText: text }) => {
  const methods = useForm();
  const { reset, handleSubmit } = methods;

  React.useEffect(() => {
    reset({ text });
  }, [reset, text]);

  const onSave = (data) => {
    onSubmit(data);
    onToggle();
  };

  return (
    <Modal size="sm" containerClass="bg-secondary" onToggle={onToggle}>
      <div className="p-6">
        <ModalHeader onToggle={onToggle}>Insert Hyperlink</ModalHeader>
        <div className="mb-4">
          <Input
            label="URL"
            name="url"
            methods={methods}
            rules={{
              required: true,
              pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
            }}
          />
          <Input label="Text" name="text" methods={methods} rules={{ required: true }} />
        </div>

        <ModalFooter>
          <button onClick={() => onToggle()} className="btn btn-outline">
            Close
          </button>
          <button onClick={handleSubmit(onSave)} type="submit" className="ml-3 btn btn-outline">
            Submit
          </button>
        </ModalFooter>
      </div>
    </Modal>
  );
};
