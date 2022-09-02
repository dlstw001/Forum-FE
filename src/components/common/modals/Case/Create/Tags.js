import { inject, observer } from 'mobx-react';
import { omit } from 'lodash';
import CreatableSelect from 'components/common/Form/CreatableSelect';
import React from 'react';

const Tag = ({ methods, tagStore }) => {
  const { watch, reset, getValues } = methods;
  const { tags } = watch();

  React.useEffect(() => {
    tagStore.find({ limit: 1000 });
  }, [tagStore]);

  const tagsOptions = React.useMemo(() => {
    const tags = tagStore.items.data
      .map((item) => omit(item, 'count'))
      .map((item) => ({ ...item, label: item.name, value: item.name }));

    return tags;
  }, [tagStore.items.data]);

  const createTag = async (val) => {
    const values = getValues();
    await tagStore
      .create({ name: val })
      .then(
        async ({ item }) => await reset({ ...values, tags: [{ ...item, label: item.name, value: item.name }, ...tags] })
      );
  };

  return (
    <CreatableSelect
      name="tags"
      label="Tags"
      methods={methods}
      isMulti
      options={tagsOptions}
      onCreateOption={createTag}
      data-cy="select_tags"
    />
  );
};

export default inject(({ tagStore }) => ({ tagStore }))(observer(Tag));
