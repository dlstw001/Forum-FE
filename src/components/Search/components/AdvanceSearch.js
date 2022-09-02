import { withRouter } from 'react-router-dom';
import Author from './Author';
import Categories from './Categories';
import DatePosted from './DatePosted';
import Input from 'components/common/Form/Input';
import OrderBy from './OrderBy';
import React from 'react';
import Tags from './Tags';
import useDebounce from 'hooks/useDebounce';

export default withRouter(({ methods, onChangeInput, children, term }) => {
  const [value, setValue] = React.useState(null);
  const debouncedValue = useDebounce(value, 750);

  React.useEffect(() => {
    if (debouncedValue !== null) {
      onChangeInput(debouncedValue);
    }
  }, [debouncedValue, onChangeInput]);

  return (
    <div className="p-6 bg-secondary">
      <h2 className="sidebar-title">Advance Search</h2>
      <form>
        <Input
          label="Search"
          placeholder="Search"
          name="term"
          methods={methods}
          onChange={(e) => setValue(e.target.value)}
          defaultValue={term}
          data-cy="advanced_search_input_value"
        />
        <Categories methods={methods} />
        <Tags methods={methods} />
        <DatePosted methods={methods} />
        <OrderBy methods={methods} />
        <Author methods={methods} />
        {children}
      </form>
    </div>
  );
});
