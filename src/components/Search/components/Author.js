import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import AsyncSelect from 'components/common/Form/AsyncSelect';
import React from 'react';

const Author = ({ methods, userStore, onChange }) => {
  const loadOptions = debounce((keyword, callback) => {
    if (keyword) {
      userStore.mention({ keyword }).then((res) => {
        callback(res);
      });
    } else {
      callback([]);
    }
  }, 300);

  return (
    <AsyncSelect
      name="creator"
      label="User"
      methods={methods}
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      onChange={onChange}
      getOptionLabel={(option) => option.displayName}
      getOptionValue={(option) => option._id}
      components={{ DropdownIndicator: null }}
      placeholder="Search"
      isClearable={true}
      data-cy="target_users"
    />
  );
};

export default inject(({ userStore }) => ({ userStore }))(observer(Author));
