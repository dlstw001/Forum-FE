import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import AsyncSelect from 'components/common/Form/AsyncSelect';
import React from 'react';

const Client = ({ methods, customerCaseStore }) => {
  const loadOptions = debounce((keyword, callback) => {
    if (keyword) {
      customerCaseStore.getClients(keyword).then((res) => callback(res));
    } else {
      callback([]);
    }
  }, 300);

  return (
    <AsyncSelect
      label="Client"
      name="client"
      methods={methods}
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option.id}
      components={{ DropdownIndicator: null }}
      placeholder="All"
      isClearable={true}
      data-cy="client_select"
    />
  );
};

export default inject(({ customerCaseStore }) => ({
  customerCaseStore,
}))(observer(Client));
