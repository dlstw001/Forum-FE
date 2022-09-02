import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import AsyncCreatable from 'components/common/Form/AsyncCreatable';
import React from 'react';

const CustomerClient = ({ methods, customerCaseStore }) => {
  const handleCreateOption = async (inputValue) => {
    const data = await customerCaseStore.createPartner({ name: inputValue });

    methods.setValue('partner', { ...data, value: data.id, label: data.name });
  };

  const loadOptions = debounce((keyword, callback) => {
    if (keyword) {
      customerCaseStore.getPartners(keyword).then((res) => {
        const options = res.map((item) => ({ ...item, label: item.name, value: item.id }));
        callback(options);
      });
    } else {
      callback([]);
    }
  }, 300);

  return (
    <AsyncCreatable
      label="Partner"
      name="partner"
      methods={methods}
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      isClearable
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      components={{ DropdownIndicator: null }}
      rules={{ required: true }}
      placeholder="Search"
      onCreateOption={handleCreateOption}
      data-cy="customer_case_partner"
    />
  );
};

export default inject(({ customerCaseStore }) => ({
  customerCaseStore,
}))(observer(CustomerClient));
