import React from 'react';
import Select from 'components/common/Form/Select';

export default ({ methods, onChange }) => {
  return (
    <Select
      name="orderBy"
      label="Order By"
      methods={methods}
      options={orderByOptions}
      getOptionLabel={(value) => value.name}
      getOptionValue={(value) => value.name}
      data-cy="order_by_select"
      onChange={onChange}
    />
  );
};

const orderByOptions = [
  {
    name: 'Relevance',
    sort: 'score',
  },
  {
    name: 'Newest',
    sort: 'createdAt',
  },
  {
    name: 'Latest',
    sort: 'lastModified',
  },
  {
    name: 'Last Replied',
    sort: 'lastReplied',
  },
];
