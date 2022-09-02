import { withRouter } from 'react-router-dom';
import Client from './Client';
import HottestTags from './HottestTags';
import Input from 'components/common/Form/Input';
// import Partner from './Partner';
import React from 'react';
import Select from 'components/common/Form/Select';
import Tags from './Tags';

const SORTBY_OPTIONS = [
  { key: 'latest', label: 'Latest' },
  { key: 'oldest', label: 'Oldest' },
];

export default withRouter(({ methods, onChangeInput, searchDefaultValue, children }) => {
  return (
    <>
      <div className="pb-6 mb-0 lg:px-6 lg:pt-5 lg:mb-12 bg-secondary">
        <h2 className="sidebar-title">Advance Search</h2>
        <form>
          <Input
            name="title"
            type="text"
            placeholder="Search by Title "
            methods={methods}
            onChange={onChangeInput}
            defaultValue={searchDefaultValue}
          />
          <Select
            name="sortBy"
            label="Sort By"
            methods={methods}
            options={SORTBY_OPTIONS}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.key}
            data-cy="sortBy_select"
          />
          {/* <Partner methods={methods} /> */}
          <Client methods={methods} />
          <Tags methods={methods} />
          {children}
        </form>
      </div>
      <HottestTags methods={methods} />
    </>
  );
});
