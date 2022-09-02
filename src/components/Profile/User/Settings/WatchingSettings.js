import { NOTIFICATIONLVL } from 'definitions';
import AsyncSelect from 'components/common/Form/AsyncSelect';
import React from 'react';
import Select from 'components/common/Form/Select';

const excludeFromOptions = (array, toBeRemoved) => {
  const options = array?.filter((item) => {
    const ids = toBeRemoved?.map((i) => i._id);

    return !ids.includes(item._id);
  });

  return options;
};

export default ({ categories, tags, methods, loadOptions }) => {
  const categoryOptions = React.useMemo(() => categories.data, [categories.data]);
  const tagsOptions = React.useMemo(() => tags.data, [tags.data]);
  const { watch } = methods;
  const { watchedCategories, watchedFirstCategories, mutedCategories, watchedTags, watchedFirstTags, mutedTags } =
    watch();

  const watchedCatOptions = excludeFromOptions(categoryOptions, [
    ...(watchedFirstCategories || []),
    ...(mutedCategories || []),
  ]);

  const watchedFirstCatOptions = excludeFromOptions(categoryOptions, [
    ...(watchedCategories || []),
    ...(mutedCategories || []),
  ]);

  const mutedCatOptions = excludeFromOptions(categoryOptions, [
    ...(watchedCategories || []),
    ...(watchedFirstCategories || []),
  ]);

  const watchedTagOptions = excludeFromOptions(tagsOptions, [...(watchedFirstTags || []), ...(mutedTags || [])]);
  const watchedFirstTagOptions = excludeFromOptions(tagsOptions, [...(watchedTags || []), ...(mutedTags || [])]);
  const mutedTagOptions = excludeFromOptions(tagsOptions, [...(watchedTags || []), ...(watchedFirstTags || [])]);

  return (
    <>
      <div className="mb-8">
        <div>
          <h4 className="summary-subtitle">Watching preferences</h4>
          <h6 className="settings-select-subtitle">When I post in a topic, set that topic to</h6>
          <Select
            label="Watched"
            name="postDefaultLv"
            methods={methods}
            options={NOTIFICATIONLVL}
            getOptionLabel={(value) => value.label}
            getOptionValue={(value) => value.name}
            isBrown={true}
            className="md:w-1/3"
            data-cy="postDefaultLv"
          />

          <h6 className="settings-select-subtitle">Categories</h6>
          <div className="my-6 md:grid grid-cols-3 gap-x-4">
            <div>
              <Select
                label="Watched"
                name="watchedCategories"
                methods={methods}
                isMulti
                options={watchedCatOptions}
                getOptionLabel={(value) => value.name}
                getOptionValue={(value) => value.name}
                isBrown={true}
                data-cy="watchedCategories"
              />
              <div className="text-xs">
                You will automatically watch all topics in these categories. You will be notified of all new posts and
                topics, and a count of new posts will also appear next to the topic.
              </div>
            </div>
            <div>
              <Select
                label="Watching First Post"
                name="watchedFirstCategories"
                methods={methods}
                isMulti
                options={watchedFirstCatOptions}
                getOptionLabel={(value) => value.name}
                getOptionValue={(value) => value.name}
                isBrown={true}
                data-cy="watchedFirstCategories"
              />
              <div className="text-xs">
                You will be notified of the first post in each new topic in these categories.
              </div>
            </div>
            <div>
              <Select
                label="Muted"
                name="mutedCategories"
                methods={methods}
                isMulti
                options={mutedCatOptions}
                getOptionLabel={(value) => value.name}
                getOptionValue={(value) => value.name}
                isBrown={true}
                data-cy="mutedCategories"
              />
              <div className="text-xs">
                You will not be notified of anything about new topics in these categories, and they will not appear on
                the categories or latest pages.
              </div>
            </div>
          </div>
        </div>
        <div>
          <h6 className="settings-select-subtitle">Tags</h6>
          <div className="my-6 md:grid grid-cols-3 gap-x-4">
            <div>
              <Select
                label="Watched"
                name="watchedTags"
                methods={methods}
                isMulti
                options={watchedTagOptions}
                getOptionLabel={(value) => value.name}
                getOptionValue={(value) => value.name}
                isBrown={true}
                data-cy="watchedTags"
              />
              <div className="text-xs">
                You will automatically watch all topics in these tags. You will be notified of all new posts and topics,
                and a count of new posts will also appear next to the topic.
              </div>
            </div>
            <div>
              <Select
                label="Watching First Post"
                name="watchedFirstTags"
                methods={methods}
                isMulti
                options={watchedFirstTagOptions}
                getOptionLabel={(value) => value.name}
                getOptionValue={(value) => value.name}
                isBrown={true}
                data-cy="watchedFirstTags"
              />
              <div className="text-xs">You will be notified of the first post in each new topic in these tags.</div>
            </div>
            <div>
              <Select
                label="Muted"
                name="mutedTags"
                methods={methods}
                isMulti
                options={mutedTagOptions}
                getOptionLabel={(value) => value.name}
                getOptionValue={(value) => value.name}
                isBrown={true}
                data-cy="mutedTags"
              />
              <div className="text-xs">
                You will not be notified of anything about new topics with these tags, and they will not appear in
                latest.
              </div>
            </div>
          </div>
        </div>
        <div>
          <h4 className="settings-select-subtitle">Users</h4>
          <div className="my-6 md:grid grid-cols-3 gap-x-4">
            <div>
              <AsyncSelect
                label="Ignored"
                name="ignoredUser"
                className="mb-6"
                methods={methods}
                // rules={{ required: true }}
                cacheOptions
                defaultOptions
                loadOptions={loadOptions}
                getOptionLabel={(option) => option.displayName}
                getOptionValue={(option) => option._id}
                components={{ DropdownIndicator: null }}
                placeholder="Please select"
                isClearable={true}
                data-cy="ignoredUser"
                isMulti
                isBrown={true}
              />
              <div className="text-xs">Suppress all posts, notifications and PMs from these users.</div>
            </div>
            <div>
              <AsyncSelect
                label="Private Messages"
                name="mutedUser"
                className="mb-6"
                methods={methods}
                // rules={{ required: true }}
                cacheOptions
                defaultOptions
                loadOptions={loadOptions}
                getOptionLabel={(option) => option.displayName}
                getOptionValue={(option) => option._id}
                components={{ DropdownIndicator: null }}
                placeholder="Please select"
                isClearable={true}
                data-cy="mutedUser"
                isMulti
                isBrown={true}
              />
              <div className="text-xs">Suppress all notifications and PMs from these users.</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
