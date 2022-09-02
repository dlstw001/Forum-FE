import { addMonths, addWeeks, endOfMonth, endOfWeek, format, isFuture, set } from 'date-fns';
import { colorHex, dateFormat } from 'utils';
import { inject } from 'mobx-react';
import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import { useForm } from 'react-hook-form';
import DatePicker from 'components/common/Form/DatePicker';
import Input from 'components/common/Form/Input';
import React from 'react';
import Select from 'components/common/Form/Select';
import TimePicker from 'components/common/Form/TimePicker';

const TopicTimerModal = ({ id, onSuccess, onToggle, timerStore, categoryStore }) => {
  const methods = useForm({
    defaultValues: {
      // date: new Date(),
      // time: '15:00',
    },
  });

  const { handleSubmit, watch } = methods;
  const { execution_time, action, date } = watch();

  React.useEffect(() => {
    categoryStore.all();
  }, [categoryStore]);

  const onSave = async (data) => {
    const { action, execution_time, category, noHourLastPost } = data;
    const executionTime = Object.assign({}, execution_time);
    if (execution_time.value === 'custom') {
      executionTime.value = new Date(`${format(data.date, 'MM/dd/yyyy')} ${data.time}`);
    }
    const payload = {
      ...(category && { category: category._id }),
      action: action.value,
      ...(execution_time.value === 'noHourLastPost'
        ? { noHourLastPost: noHourLastPost }
        : { execution_time: executionTime.value }),
    };

    await timerStore.update(id, payload);
    onSuccess();
  };

  return (
    <Modal size="sm" containerClass="bg-secondary" onToggle={onToggle}>
      <form className="p-6" onSubmit={handleSubmit(onSave)}>
        <ModalHeader onToggle={onToggle}>Topic Timer</ModalHeader>
        <Select
          name="action"
          methods={methods}
          options={timerSettingList}
          rules={{ required: true }}
          getOptionLabel={(value) => value.label}
          getOptionValue={(value) => value.label}
          data-cy="timer_type"
        />
        {action && action.value === 'publish' && (
          <Select
            label="Section"
            name="category"
            methods={methods}
            options={categoryStore.mapped}
            rules={{ required: true }}
            getOptionLabel={(value) => (
              <div className="flex items-center">
                {value.parent && <span className="mr-4">{value.parent.name}</span>}
                <span className="w-3 h-3 mr-2" style={{ backgroundColor: colorHex(value.color) }}></span> {value.name}
              </div>
            )}
            getOptionValue={(value) => value.name}
          />
        )}
        {action && (
          <Select
            label="When"
            name="execution_time"
            methods={methods}
            className="w-full ml-auto"
            options={timerTimeSettingList}
            rules={{ required: true }}
            getOptionLabel={(value) => (
              <div className="flex">
                <i className="mr-2 material-icons md-20">{value.icon}</i> {value.label}
                {value?.preview && <span className="ml-auto opacity-50">{value?.preview}</span>}
              </div>
            )}
            getOptionValue={(value) => value.label}
            data-cy="timer_time"
          />
        )}
        {execution_time && execution_time.value === 'custom' && (
          <div className="flex gap-4">
            <DatePicker
              label="Date"
              name="date"
              format="dd-MMM-yyyy"
              methods={methods}
              rules={{ required: true }}
              data-cy="topic_timer_date"
              dayPickerProps={{ disabledDays: { before: new Date() } }}
            />
            <TimePicker
              label="Time (24 hr format)"
              name="time"
              methods={methods}
              rules={{
                required: true,
                validate: {
                  isFuture: (value) => {
                    return isFuture(new Date(`${format(date, 'MM-dd-yyyy')} ${value}`));
                  },
                },
              }}
              containerClassName="w-1/2"
              className="w-full"
            />
          </div>
        )}
        {execution_time && execution_time.value === 'noHourLastPost' && (
          <Input
            placeholder="Number of hours"
            type="number"
            name="noHourLastPost"
            methods={methods}
            rules={{
              required: true,
            }}
            data-cy="noHourLastPost"
          />
        )}

        <ModalFooter>
          <button onClick={() => onToggle()} className="btn btn-outline" data-cy="cancel_btn">
            Cancel
          </button>
          <button disabled={!action} className="ml-3 btn btn-outline" data-cy="set_timer_btn">
            Set Timer
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default inject(({ timerStore, categoryStore }) => ({ timerStore, categoryStore }))(TopicTimerModal);

const timerSettingList = [
  {
    label: 'Auto-Close Topic',
    value: 'close',
  },
  {
    label: 'Close Temporarily',
    value: 'reopen',
  },
  {
    label: 'Schedule Publishing',
    value: 'publish',
  },
  {
    label: 'Auto-Bump Topic',
    value: 'bump',
  },
  {
    label: 'Auto-Delete Topic',
    value: 'delete',
  },
  {
    label: 'Auto-Delete Replies',
    value: 'delete-replies',
  },
];

const timerTimeSettingList = [
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
  {
    label: 'Based on last post',
    icon: 'schedule',
    value: 'noHourLastPost',
  },
];
