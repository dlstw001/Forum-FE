import { colorHex } from 'utils';
import { components } from 'react-select';
import { inject, observer } from 'mobx-react';
import React from 'react';
import Select from 'components/common/Form/Select';

const OptionItem = ({ data }) => (
  <div className="flex items-center">
    {data.parent && (
      <>
        {data.read_restricted && <i className="material-icons md-12 archived">lock</i>}
        <span className="w-3 h-3 mr-2" style={{ backgroundColor: colorHex(data.parent.color) }} />
        <span className="mr-4">{data.parent.name}</span>
      </>
    )}
    {data.read_restricted && <i className="material-icons md-12 archived">lock</i>}
    <span className="w-3 h-3 mr-2" style={{ backgroundColor: colorHex(data.color) }} />
    <span className="mr-4">{data.name}</span>
  </div>
);

const Option = ({ data, ...props }) => (
  <components.Option {...props}>
    <OptionItem data={data} />
  </components.Option>
);

const SingleValue = ({ data, ...props }) => (
  <components.SingleValue {...props}>
    <OptionItem data={data} />
  </components.SingleValue>
);

const CategoriesField = ({ name = 'category', methods, categoryStore, rules = { required: true } }) => {
  return (
    <Select
      name={name}
      methods={methods}
      options={categoryStore.items.data.filter((i) => i.canPost)}
      rules={rules}
      getOptionValue={(option) => option._id}
      getOptionLabel={(option) => option.name}
      data-cy="select_category"
      components={{
        Option,
        SingleValue,
      }}
    />
  );
};

export default inject(({ categoryStore }) => ({ categoryStore }))(observer(CategoriesField));
