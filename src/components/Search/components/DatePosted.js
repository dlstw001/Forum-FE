import DatePicker from 'components/common/Form/DatePicker';
import Input from 'components/common/Form/Input';
import React from 'react';
import Select from 'components/common/Form/Select';

const OPTIONS = [
  { key: 'anytime', label: 'Any Time' },
  { key: 'past_month', label: 'Past Month' },
  { key: 'past_week', label: 'Past Week' },
  { key: 'past_24hrs', label: 'Past 24 hours' },
  { key: 'fromTo', label: 'Date From and To' },
];

export default ({ methods }) => {
  const { getValues } = methods;
  const { from, to, datePosted } = getValues();

  return (
    <>
      <Select
        methods={methods}
        label="Date Posted"
        name="datePosted"
        options={OPTIONS}
        getOptionValue={(option) => option.key}
        getOptionLabel={(option) => option.label}
        isClearable={false}
        defaultValue={OPTIONS[0]}
        data-cy="date_select"
      />
      {datePosted?.key === 'fromTo' && (
        <>
          <DatePicker
            methods={methods}
            name="from"
            label="Start Date"
            format="dd-MMM-yyyy"
            rules={{ required: true }}
            className="w-full"
            dayPickerProps={{
              disabledDays: [to ? { after: new Date(to) } : {}, { after: new Date() }],
            }}
          />
          <DatePicker
            methods={methods}
            name="to"
            label="End Date"
            format="dd-MMM-yyyy"
            rules={{ required: true }}
            className="w-full"
            dayPickerProps={{
              disabledDays: { after: new Date(), ...(from ? { before: new Date(from) } : {}) },
            }}
          />
          <Input type="hidden" name="tz" methods={methods} />
        </>
      )}
    </>
  );
};
