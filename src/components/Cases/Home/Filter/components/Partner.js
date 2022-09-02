import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import AsyncSelect from 'components/common/Form/AsyncSelect';
import React from 'react';

const Partner = ({ methods, customerCaseStore }) => {
  const loadOptions = debounce((keyword, callback) => {
    if (keyword) {
      customerCaseStore.getPartners(keyword).then((res) => callback(res));
    } else {
      callback([]);
    }
  }, 300);

  return (
    <AsyncSelect
      label="Partner"
      name="partner"
      methods={methods}
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option.id}
      components={{ DropdownIndicator: null }}
      placeholder="All"
      isClearable={true}
      data-cy="partner_select"
    />
  );
};

export default inject(({ customerCaseStore }) => ({
  customerCaseStore,
}))(observer(Partner));
