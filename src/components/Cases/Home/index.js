import { addQueryParams, removeQueryParams } from 'utils';
import { inject, observer } from 'mobx-react';
import { LOGIN_URL } from 'definitions';
import { useForm } from 'react-hook-form';
import Card from './Card';
import Create from 'components/common/modals/Case/Create';
import FilterMobile from './Filter/FilterMobile';
import Filters from './Filter';
import qs from 'query-string';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import useToggle from 'hooks/useToggle';

const defaultValuesField = () => ({
  orderBy: {
    name: 'Relevance',
    sort: 'score',
  },
  tags: null,
});

const defaultValuesFilter = () => ({ sort: 'score' });

const CustomerCases = ({ searchStore, userStore, history }) => {
  const { term, create } = qs.parse(history.location.search);
  const [isLoading, setIsLoading] = React.useState(true);
  const [items, setItems] = React.useState({ data: [] });
  const [filters, setFilters] = React.useState({ ...defaultValuesFilter(), term: term });

  const methods = useForm({ defaultValues: defaultValuesField() });
  const { reset, getValues } = methods;
  const { toggle, handleToggle } = useToggle({ createModal: false, filterModal: false });

  const getData = React.useCallback(async () => {
    const payload = { ...filters, isCase: true };

    await searchStore
      .getAdvanced(payload)
      .then((res) => setItems((prevState) => ({ ...res, data: [...prevState.data, ...res.data] })))
      .finally(() => setIsLoading(false));
  }, [searchStore, filters]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  React.useEffect(() => {
    if (term) reset({ ...getValues(), term: term });
  }, [reset, getValues, term]);

  const onChangeInput = React.useCallback(
    (term) => {
      setItems({ data: [] });
      term ? addQueryParams('term', term, history) : removeQueryParams('term', history);

      setFilters((prevState) => ({ ...prevState, ...(term ? { term: term } : { term: null }) }));
    },
    [history]
  );

  const handleFilterChange = () => {
    const { orderBy, tags } = getValues();
    const payload = {
      page: 1,
      limit: 20,
      ...(term ? { term: term } : {}),
      ...(orderBy ? { sort: orderBy.sort } : { sort: 'score' }),
      ...(tags ? { tags: tags.map((tag) => tag._id) } : {}),
    };

    setItems({ data: [] });
    setFilters(payload);
  };

  const handleReset = () => {
    removeQueryParams('term', history);
    reset(defaultValuesField());
    setFilters({ ...defaultValuesFilter() });
    setItems({ data: [] });
  };

  // if userStore.user and create is both true then open the createModal
  React.useEffect(() => {
    if (create) {
      if (userStore?.user) handleToggle({ createModal: true });
      else window.location.href = LOGIN_URL;
    }
  }, [create, handleToggle, userStore.user]);

  return (
    <>
      <main id="all-topics" className="container wrapper lg:flex customer-cases-listing">
        <div className="hidden lg:mr-16 sidebar lg:block">
          <div className="sidebar-sticky-margin">
            <Filters methods={methods} onChange={handleFilterChange} onChangeInput={onChangeInput}>
              <button className="block w-full btn btn-outline" type="button" onClick={handleReset} data-cy="reset_btn">
                Reset
              </button>
            </Filters>
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Customer Cases</h2>
            <div className="flex items-center">
              <button
                onClick={() => handleToggle({ filterModal: true })}
                className="inline-block text-xs btn btn-outline lg:hidden"
              >
                <i className="icon-view-all material-icons md-16 md:mr-1">search</i>
                Show Filters
              </button>
              <button className="ml-2 btn btn-primary" onClick={() => handleToggle({ createModal: true })}>
                Create Cases
              </button>
            </div>
          </div>

          <div className="mb-12 grid gap-6 lg:grid-cols-3 md:grid-cols-3 xs:grid-cols-2">
            {isLoading &&
              [...Array(10)].map((i, index) => (
                <div key={index}>
                  <div className="hidden xl:block">
                    <Skeleton height={225} width={300} />
                  </div>
                  <div className="block xl:hidden">
                    <Skeleton height={225} width={215} />
                  </div>
                </div>
              ))}

            {!isLoading && items?.data?.length === 0 && <h1>No results found</h1>}

            {!isLoading &&
              items?.data?.map((i, index) => (
                <Card key={index} data={i} methods={methods} onChange={handleFilterChange} />
              ))}
          </div>
        </div>
      </main>
      {toggle.createModal && <Create onToggle={(show) => handleToggle({ createModal: show || !toggle.createModal })} />}
      {toggle.filterModal && (
        <FilterMobile
          onToggleFilterModal={() => handleToggle({ filterModal: !toggle.filterModal })}
          methods={methods}
          onChangeInput={onChangeInput}
          onReset={handleReset}
        />
      )}
    </>
  );
};

export default inject(({ searchStore, userStore }) => ({ searchStore, userStore }))(observer(CustomerCases));
