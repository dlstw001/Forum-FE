import { colorHex } from 'utils';
import { debounce } from 'lodash';
import { FLAGSTATUS } from 'definitions';
import { inject, observer } from 'mobx-react';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';
import AsyncSelect from 'components/common/Form/AsyncSelect';
import DatePicker from 'components/common/Form/DatePicker';
import React from 'react';
import Select from 'components/common/Form/Select';

const defaultValues = () => ({
  status: null,
  type: null,
  review_type: null,
  priority: null,
  category: null,
  reviewer: null,
  user: null,
  date_from: null,
  date_to: null,
  orderBy: null,
});

const Filters = ({ userStore, categoryStore, onChange }) => {
  const methods = useForm({
    mode: 'onChange',
    defaultValues,
  });
  const { reset, getValues, handleSubmit } = methods;

  React.useEffect(() => {
    const { status } = getValues();

    if (status === null) reset({ status: FLAGSTATUS[0] });
  }, [reset, getValues]);

  const loadOptions = debounce((keyword, callback) => {
    if (keyword) {
      userStore.find({ displayName: keyword }).then((res) => {
        callback(res.data);
      });
    } else {
      callback([]);
    }
  }, 300);

  React.useEffect(() => {
    categoryStore.find({ limit: 100 });
  }, [categoryStore]);

  const handleReset = () => {
    reset(defaultValues());
  };

  const onSubmit = (form) => {
    onChange(form);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="px-6 py-4 sidebar filter bg-secondary">
        <h3 className="sidebar-title">Filter</h3>

        <div>
          <h3 className="filter-title">Status</h3>
          <Select
            name="status"
            className="mb-6"
            methods={methods}
            onChange={handleSubmit(onSubmit)}
            options={FLAGSTATUS}
            getOptionLabel={(value) => value.name}
            getOptionValue={(value) => value.name}
            data-cy="status_select"
          />

          <h3 className="filter-title">Category</h3>
          <Select
            name="category"
            className="mb-6"
            methods={methods}
            onChange={handleSubmit(onSubmit)}
            options={categoryStore.items.data}
            getOptionLabel={(value) => (
              <div className="flex items-center">
                {value.read_restricted && <i className="material-icons md-12 archived">lock</i>}
                <span className="w-3 h-3 mr-2" style={{ backgroundColor: colorHex(value.color) }} />
                <span className="mr-4">{value.name}</span>
              </div>
            )}
            getOptionValue={(value) => value.name}
            data-cy="category_select"
          />

          <h3 className="filter-title">Post Type</h3>
          <Select
            name="type"
            className="mb-6"
            methods={methods}
            onChange={handleSubmit(onSubmit)}
            options={typeOptions}
            getOptionLabel={(value) => value.name}
            getOptionValue={(value) => value.name}
            data-cy="post_type_select"
          />

          <h3 className="filter-title">Reviewable Type</h3>
          <Select
            name="review_type"
            className="mb-6"
            methods={methods}
            onChange={handleSubmit(onSubmit)}
            options={review_type}
            getOptionLabel={(value) => value.name}
            getOptionValue={(value) => value.value}
            data-cy="reviewable_type_select"
          />

          <h3 className="filter-title">Minimum Priority</h3>
          <Select
            name="priority"
            className="mb-6"
            methods={methods}
            onChange={handleSubmit(onSubmit)}
            options={minPriorityOptions}
            getOptionLabel={(value) => value.name}
            getOptionValue={(value) => value.name}
            data-cy="minimum_priority_select"
          />

          <h3 className="filter-title">Review By</h3>
          <AsyncSelect
            name="reviewer"
            className="mb-6"
            methods={methods}
            onChange={handleSubmit(onSubmit)}
            // rules={{ required: true }}
            cacheOptions
            defaultOptions
            loadOptions={loadOptions}
            getOptionLabel={(option) => option.displayName}
            getOptionValue={(option) => option._id}
            components={{ DropdownIndicator: null }}
            placeholder="Please select"
            isClearable={true}
            data-cy="review_by_select"
            isBrown={true}
          />

          <h3 className="filter-title">User</h3>
          <AsyncSelect
            name="user"
            className="mb-6"
            methods={methods}
            onChange={handleSubmit(onSubmit)}
            // rules={{ required: true }}
            cacheOptions
            defaultOptions
            loadOptions={loadOptions}
            getOptionLabel={(option) => option.displayName}
            getOptionValue={(option) => option._id}
            components={{ DropdownIndicator: null }}
            placeholder="Please select"
            isClearable={true}
            data-cy="user_select"
            isBrown={true}
          />

          <h3 className="filter-title">Date</h3>
          <div className="flex">
            <DatePicker
              className="w-full mr-2"
              name="date_from"
              format="dd-MMM-yyyy"
              methods={methods}
              data-cy="date_from"
              onChange={handleSubmit(onSubmit)}
            />
            <DatePicker
              className="w-full"
              name="date_to"
              format="dd-MMM-yyyy"
              methods={methods}
              data-cy="date_to"
              onChange={handleSubmit(onSubmit)}
            />
          </div>

          <h3 className="filter-title">Order By</h3>
          <Select
            name="orderBy"
            className="mb-6"
            methods={methods}
            options={orderByOptions}
            getOptionLabel={(value) => value.name}
            getOptionValue={(value) => value.name}
            data-cy="order_by_select"
            onChange={handleSubmit(onSubmit)}
          />
        </div>
        <div className="flex btn-action-set">
          <button onClick={() => handleReset()} className="w-full btn btn-outline" data-cy="reset_btn">
            Reset
          </button>
        </div>
      </div>
    </form>
  );
};
export default inject(({ reviewStore, userStore, categoryStore }) => ({ reviewStore, userStore, categoryStore }))(
  withRouter(observer(Filters))
);

const typeOptions = [
  {
    name: 'Flagged Post',
    value: 'ReviewableFlaggedPost',
  },
  {
    name: 'Queued Post',
    value: 'ReviewableQueuedPost',
  },
  {
    name: 'User',
    value: 'ReviewableUser',
  },
  {
    name: 'Akismet Flagged Post',
    value: 'ReviewableAkismetPost',
  },
];

const minPriorityOptions = [
  {
    name: 'Low',
    score_from: 0,
    score_to: 5,
  },
  {
    name: 'Medium',
    score_from: 5,
    score_to: 10,
  },
  {
    name: 'High',
    score_from: 10,
    score_to: 100,
  },
];

const review_type = [
  {
    name: 'Off-Topic',
    value: 'off_topic',
  },
  {
    name: 'Inappropriate',
    value: 'inappropriate',
  },
  {
    name: 'Spam',
    value: 'spam',
  },
  {
    name: 'Notify User',
    value: 'notify_user',
  },
  {
    name: 'Notify Moderator',
    value: 'notify_moderators',
  },
];

const orderByOptions = [
  {
    name: 'Score',
    sort_by: 'totalScore',
    order_by: 'desc',
  },
  {
    name: 'Score (reverse)',
    sort_by: 'totalScore',
    order_by: 'asc',
  },
  {
    name: 'Created At',
    sort_by: 'createdAt',
    order_by: 'desc',
  },
  {
    name: 'Created At (reverse)',
    sort_by: 'createdAt',
    order_by: 'asc',
  },
];
