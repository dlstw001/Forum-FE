import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import AsyncCreatable from 'components/common/Form/AsyncCreatable';
import React from 'react';

const CustomerClient = ({ methods, customerCaseStore }) => {
  const handleCreateOption = async (inputValue) => {
    const data = await customerCaseStore.createTag({ name: inputValue });

    methods.setValue('tags', { ...data, value: data.id, label: data.name });
  };

  const loadOptions = debounce((keyword, callback) => {
    if (keyword) {
      customerCaseStore.getTags(keyword).then((res) => {
        const options = res.map((item) => ({ ...item, label: item.name, value: item.id }));
        callback(options);
      });
    } else {
      callback([]);
    }
  }, 300);

  return (
    <AsyncCreatable
      label="Tags"
      name="tags"
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
      data-cy="customer_case_tags"
    />
  );
};

export default inject(({ customerCaseStore }) => ({
  customerCaseStore,
}))(observer(CustomerClient));
