import { dateFormat } from 'utils';
import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import { useForm } from 'react-hook-form';
import DatePicker from 'components/common/Form/DatePicker';
import React from 'react';

export default ({ onToggle, onSubmit, data }) => {
  const methods = useForm();
  const { handleSubmit, reset, watch } = methods;
  const { from, to } = watch();

  React.useEffect(() => {
    if (data) reset(data);
  }, [reset, data]);

  const onHandleSubmit = ({ from, to }) => {
    onSubmit({ from: dateFormat(from, 'yyyy-MM-dd'), to: dateFormat(to, 'yyyy-MM-dd') });
    onToggle();
  };

  return (
    <Modal size="xs" containerClass="bg-secondary" onToggle={onToggle}>
      <form className="p-6" onSubmit={handleSubmit(onHandleSubmit)}>
        <ModalHeader onToggle={onToggle}>Date range</ModalHeader>

        <div className="flex">
          <DatePicker
            label="From"
            className="w-full"
            name="from"
            format="yyyy-MM-dd"
            methods={methods}
            rules={{ required: true }}
            dayPickerProps={{
              disabledDays: [to ? { after: new Date(to) } : {}, { after: new Date() }],
            }}
          />
          <DatePicker
            label="To"
            className="w-full"
            name="to"
            format="yyyy-MM-dd"
            methods={methods}
            rules={{ required: true }}
            dayPickerProps={{
              disabledDays: { after: new Date(), ...(from ? { before: new Date(from) } : {}) },
            }}
          />
        </div>

        <ModalFooter>
          <button className="ml-3 btn btn-outline" onClick={() => onToggle()}>
            Cancel
          </button>
          <button className="ml-3 btn btn-outline">Confirm</button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
