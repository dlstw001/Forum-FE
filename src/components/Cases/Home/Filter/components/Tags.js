import { inject, observer } from 'mobx-react';
import React from 'react';
import Select from 'components/common/Form/Select';

const Tags = ({ methods, tagStore, onChange }) => {
  React.useEffect(() => {
    tagStore.find({ limit: 1000 });
  }, [tagStore]);

  return (
    <Select
      name="tags"
      label="Tags"
      onChange={onChange}
      methods={methods}
      options={[...tagStore?.items?.data] || []}
      getOptionValue={(option) => option._id}
      getOptionLabel={(option) => option.name}
      isMulti={true}
      placeholder="All"
      isClearable={true}
      closeMenuOnSelect={false}
      data-cy="tags_select"
    />
  );
};

export default inject(({ tagStore }) => ({ tagStore }))(observer(Tags));
