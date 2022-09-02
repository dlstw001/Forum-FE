import { withRouter } from 'react-router-dom';
// import Client from './components/Client';
import HottestTags from './components/HottestTags';
import Input from 'components/common/Form/Input';
// import Partner from './components/Partner';
import OrderBy from './components/OrderBy';
import React from 'react';
import Tags from './components/Tags';
import useDebounce from 'hooks/useDebounce';

export default withRouter(({ methods, onChangeInput, onChange, children }) => {
  const [value, setValue] = React.useState(null);
  const debouncedValue = useDebounce(value, 750);

  React.useEffect(() => {
    if (debouncedValue !== null) {
      onChangeInput(debouncedValue);
    }
  }, [debouncedValue, onChangeInput]);

  return (
    <>
      <div className="pb-6 mb-0 lg:px-6 lg:pt-5 lg:mb-12 bg-secondary">
        <h2 className="sidebar-title">Advance Search</h2>
        <form>
          <Input
            label="Search"
            placeholder="Search"
            name="term"
            methods={methods}
            onChange={(e) => setValue(e.target.value)}
            data-cy="advanced_search_input_value"
          />
          <OrderBy methods={methods} onChange={onChange} />
          {/* <Partner methods={methods} /> */}
          {/* <Client methods={methods} onChange={onChange} /> */}
          <Tags methods={methods} onChange={onChange} />
          {children}
        </form>
      </div>
      <HottestTags methods={methods} onChange={onChange} />
    </>
  );
});
