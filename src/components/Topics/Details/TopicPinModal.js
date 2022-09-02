import { addMonths, addWeeks, endOfMonth, endOfWeek, format, set } from 'date-fns';
import { dateFormat } from 'utils';
import { inject } from 'mobx-react';
import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import { useForm } from 'react-hook-form';
import DatePicker from 'components/common/Form/DatePicker';
import React from 'react';
import Select from 'components/common/Form/Select';
import TimePicker from 'components/common/Form/TimePicker';

const TopicPinModal = ({ id, onSuccess, onToggle, postStore }) => {
  const [isGlobal, setIsGlobal] = React.useState(false);
  const methods = useForm({
    defaultValues: {
      // date: new Date(),
      // time: '15:00',
    },
  });

  const { handleSubmit, watch } = methods;
  const isPinnedUntil = watch('isPinnedUntil');

  const onSave = async (data) => {
    const { isPinnedUntil } = data;
    const executionTime = Object.assign({}, isPinnedUntil);
    if (isPinnedUntil.value === 'custom') {
      executionTime.value = new Date(`${format(data.date, 'MM/dd/yyyy')} ${data.time}`);
    }
    const payload = {
      ...(isPinnedUntil.value && { isPinnedUntil: executionTime.value }),
      isPinnedGlobally: isGlobal ? true : false,
    };

    await postStore.pin(id, payload);
    onSuccess();
  };

  return (
    <Modal size="sm" containerClass="bg-secondary" onToggle={onToggle}>
      <div className="p-6">
        <ModalHeader onToggle={onToggle}>Topic Pin</ModalHeader>
        <form onSubmit={handleSubmit(onSave)} className="mb-4">
          <Select
            name="isPinnedUntil"
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
            data-cy="pin_time"
          />
          {isPinnedUntil && isPinnedUntil.value === 'custom' && (
            <div className="flex gap-4">
              <DatePicker
                label="Date"
                name="date"
                format="dd-MMM-yyyy"
                methods={methods}
                rules={{ required: true }}
                data-cy="topic_pin_date"
              />
              <TimePicker label="Time" name="time" methods={methods} rules={{ required: true }} />
            </div>
          )}
          <ModalFooter>
            <button
              disabled={!isPinnedUntil}
              className="ml-3 btn btn-outline"
              onClick={() => setIsGlobal(true)}
              data-cy="set_global_pin_btn"
            >
              Pin Topic Globally
            </button>
            <button disabled={!isPinnedUntil} className="ml-3 btn btn-outline" data-cy="set_local_pin_btn">
              Pin Topic
            </button>
          </ModalFooter>
        </form>
      </div>
    </Modal>
  );
};

export default inject(({ postStore }) => ({ postStore }))(TopicPinModal);

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
    label: 'Forever',
    icon: 'gavel',
    value: null,
  },
  {
    label: 'Pick date and time',
    icon: 'event',
    value: 'custom',
  },
];
