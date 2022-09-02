import { colorHex } from 'utils';
import { components } from 'react-select';
import { inject, observer } from 'mobx-react';
import React from 'react';
import Select from 'components/common/Form/Select';

const Option = (props) => {
  const { data } = props;

  return (
    <components.Option {...props}>
      <div className="flex items-center">
        {data.read_restricted && <i className="material-icons md-12 archived">lock</i>}
        <span className="w-3 h-3 mr-2" style={{ backgroundColor: colorHex(data.color) }} />
        <span className="mr-4">{data.name}</span>
      </div>
    </components.Option>
  );
};
const Categories = ({ methods, categoryStore, onChange }) => {
  React.useEffect(() => {
    categoryStore.all();
  }, [categoryStore]);

  return (
    <Select
      name="categories"
      label="Categories"
      onChange={onChange}
      methods={methods}
      options={categoryStore?.list?.data || []}
      getOptionValue={(option) => option._id}
      getOptionLabel={(option) => option.name}
      isMulti={true}
      placeholder="All"
      isClearable={true}
      closeMenuOnSelect={false}
      data-cy="categories_select"
      components={{
        Option: Option,
      }}
    />
  );
};

export default inject(({ categoryStore }) => ({ categoryStore }))(observer(Categories));
