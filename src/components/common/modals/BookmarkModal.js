import { addMonths, addWeeks, endOfMonth, endOfWeek, set } from 'date-fns';
import { dateFormat } from 'utils';
import { inject, observer } from 'mobx-react';
import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';
import DatePicker from 'components/common/Form/DatePicker';
import Input from 'components/common/Form/Input';
import React from 'react';
import Select from 'components/common/Form/Select';
import TimePicker from 'components/common/Form/TimePicker';

const CreateBookmark = ({ onToggle }) => {
  const methods = useForm({
    defaultValues: {},
  });

  const { handleSubmit, watch } = methods;

  const bookmarkTime = watch('bookmarkTime');

  const onSave = async () => {
    onToggle(false);
  };

  return (
    <Modal size="sm" containerClass="overflow-visible bg-secondary" onToggle={onToggle}>
      <form className="p-8" onSubmit={handleSubmit(onSave)}>
        <ModalHeader onToggle={onToggle}>Create a bookmark</ModalHeader>
        <div className="">
          <div className="mb-4 form-group">
            <div className="group-modal-title">
              What is this bookmark for? <sup>*</sup>
            </div>
            <Input className="mb-3" name="title" methods={methods} rules={{ required: true }} />

            <div className="group-modal-title">Automatically delete</div>
            <Select
              name="function"
              methods={methods}
              className="w-full ml-auto"
              options={deleteSettingsList}
              getOptionLabel={(value) => value.label}
              getOptionValue={(value) => value.label}
            />

            <div className="group-modal-title">
              Remind me <sup>*</sup>
            </div>
            <Select
              name="bookmarkTime"
              methods={methods}
              className="w-full ml-auto"
              options={timeSettingList}
              rules={{ required: true }}
              getOptionLabel={(value) => (
                <div className="flex">
                  <i className="mr-2 material-icons md-20">{value.icon}</i> {value.label}
                  {value?.preview && <span className="ml-auto opacity-50">{value?.preview}</span>}
                </div>
              )}
              getOptionValue={(value) => value.label}
            />
            {bookmarkTime && bookmarkTime.value === 'custom' && (
              <div className="flex gap-4">
                <DatePicker
                  label="Date"
                  name="date"
                  format="dd-MMM-yyyy"
                  methods={methods}
                  rules={{ required: true }}
                />
                <TimePicker label="Time" name="time" methods={methods} rules={{ required: true }} />
              </div>
            )}
          </div>
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

export default inject(() => ({}))(withRouter(observer(CreateBookmark)));

const deleteSettingsList = [
  {
    label: 'Never',
    value: 'never',
  },
  {
    label: 'Once the reminder is sent',
    value: 'theReminder',
  },
  {
    label: 'After I reply to this topic',
    value: 'afterReply',
  },
];

const timeSettingList = [
  {
    label: 'Later today',
    icon: 'brightness_3',
    value: set(new Date(), { hours: 18, minutes: 0, seconds: 0 }),
    preview: dateFormat(set(new Date(), { hours: 18, minutes: 0, seconds: 0 }), 'h bbb'),
  },
  {
    label: 'Tomorrow',
    icon: 'settings',
    value: set(new Date(), { hours: 42, minutes: 0, seconds: 0 }),
    preview: dateFormat(set(new Date(), { hours: 42, minutes: 0, seconds: 0 }), 'ccc, h bbb'),
  },
  {
    label: 'This weekend',
    icon: 'hotel',
    value: set(endOfWeek(new Date()), { hours: 18, minutes: 0, seconds: 0 }),
    preview: dateFormat(set(endOfWeek(new Date()), { hours: 18, minutes: 0, seconds: 0 }), 'ccc, h bbb'),
  },
  {
    label: 'Next week',
    icon: 'home_repair_service',
    value: set(endOfWeek(new Date()), { hours: 66, minutes: 0, seconds: 0 }),
    preview: dateFormat(set(endOfWeek(new Date()), { hours: 66, minutes: 0, seconds: 0 }), 'ccc, h bbb'),
  },
  {
    label: 'Two weeks',
    icon: 'home_repair_service',
    value: addWeeks(set(new Date(), { hours: 18, minutes: 0, seconds: 0 }), 2),
    preview: dateFormat(addWeeks(set(new Date(), { hours: 18, minutes: 0, seconds: 0 }), 2), 'LLL d'),
  },
  {
    label: 'Next month',
    icon: 'home_repair_service',
    value: set(endOfMonth(new Date()), { hours: 42, minutes: 0, seconds: 0 }),
    preview: dateFormat(set(endOfMonth(new Date()), { hours: 42, minutes: 0, seconds: 0 }), 'LLL d'),
  },
  {
    label: 'Two months',
    icon: 'home_repair_service',
    value: addMonths(set(endOfMonth(new Date()), { hours: 42, minutes: 0, seconds: 0 }), 1),
    preview: dateFormat(addMonths(set(endOfMonth(new Date()), { hours: 42, minutes: 0, seconds: 0 }), 1), 'LLL d'),
  },
  {
    label: 'Three months',
    icon: 'home_repair_service',
    value: addMonths(set(endOfMonth(new Date()), { hours: 42, minutes: 0, seconds: 0 }), 2),
    preview: dateFormat(addMonths(set(endOfMonth(new Date()), { hours: 42, minutes: 0, seconds: 0 }), 2), 'LLL d'),
  },
  {
    label: 'Four months',
    icon: 'home_repair_service',
    value: addMonths(set(endOfMonth(new Date()), { hours: 42, minutes: 0, seconds: 0 }), 3),
    preview: dateFormat(addMonths(set(endOfMonth(new Date()), { hours: 42, minutes: 0, seconds: 0 }), 3), 'LLL d'),
  },
  {
    label: 'Six months',
    icon: 'home_repair_service',
    value: addMonths(set(endOfMonth(new Date()), { hours: 42, minutes: 0, seconds: 0 }), 5),
    preview: dateFormat(addMonths(set(endOfMonth(new Date()), { hours: 42, minutes: 0, seconds: 0 }), 5), 'LLL d'),
  },
  {
    label: 'Pick date and time',
    icon: 'event',
    value: 'custom',
  },
];
