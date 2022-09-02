import { addQueryParams, removeQueryParams } from 'utils';
import { inject, observer } from 'mobx-react';
import { LOGIN_URL } from 'definitions';
import { Modal, ModalHeader } from 'components/common/Modal';
import { omit } from 'lodash';
import { uniqBy } from 'lodash';
import { useForm } from 'react-hook-form';
import Card from './components/Home/Card';
import Create from './Create';
import Filters from './components/Home/Filters';
import Loading from 'components/common/Loading';
import qs from 'query-string';
import React from 'react';
import Skeleton from './components/Home/Skeleton';
import useDebounce from 'hooks/useDebounce';
import useToggle from 'hooks/useToggle';

const initialValue = {
  limit: 15,
  order_by: 'desc',
  page: 1,
  sort_by: 'sticky',
  client: null,
  sortBy: null,
  tags: null,
};

const CustomerCases = ({ customerCaseStore, userStore, history }) => {
  const { term, create } = qs.parse(history.location.search);
  const methods = useForm({
    defaultValues: {
      client: null,
      sortBy: null,
      tags: null,
      title: term,
    },
  });
  const { watch, reset } = methods;

  const { toggle, handleToggle } = useToggle({
    createModal: false,
    filterModal: false,
  });
  const [items, setItems] = React.useState({ data: [] });
  const [isLoading, setIsLoading] = React.useState(false);
  const [isBottom, setIsBottom] = React.useState(false);
  const [keyword, setKeyword] = React.useState(term);
  const debouncedValue = useDebounce(keyword, 750);
  const [filters, setFilters] = React.useState({ ...initialValue, title: term });
  const onChangeInput = (event) => setKeyword(event.target.value);
  const isMounted = React.useRef(false);

  const { client, tags, sortBy } = watch();

  const getData = React.useCallback(() => {
    customerCaseStore.search(filters).then((res) => {
      if (Number(res?.current_page) !== 1) {
        setItems((prevState) => {
          const { data, ...rest } = prevState;

          return {
            ...rest,
            ...res,
            data: uniqBy([...data, ...res.data], 'wp_id'),
          };
        });
      } else {
        setItems(res);
      }

      setIsLoading(false);
    });
  }, [customerCaseStore, filters]);

  const updateAdvanceFilters = React.useCallback(() => {
    setItems({ data: [] });

    setFilters({
      limit: 15,
      page: 1,
      ...(client?.id && { 'client.term_id': client?.id }),
      ...(tags?.id && { 'tags.term_id': tags.id }),
      order_by: sortBy?.key === 'oldest' ? 'asc' : 'desc',
      sort_by: sortBy?.key === 'oldest' ? 'date' : 'sticky',
    });
  }, [client, sortBy, tags]);

  const fetchData = React.useCallback((options) => {
    setFilters((prevState) => ({ ...prevState, ...options }));
  }, []);

  const isScrolling = () => {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    if (scrollTop + window.innerHeight + 50 < scrollHeight) {
      setIsBottom(false);
    } else {
      setIsBottom(true);
    }
  };

  const onReset = React.useCallback(() => {
    setKeyword(null);
    setItems({ data: [] });
    reset({ tags: null, partner: null, client: null, sortBy: null, title: '' });
  }, [reset]);

  const onToggleFilterModal = () => handleToggle({ filterModal: !toggle.filterModal });
  const onClickCreateButton = () => {
    userStore?.user ? handleToggle({ createModal: true }) : (window.location.href = LOGIN_URL);
  };

  React.useEffect(() => {
    window.addEventListener('scroll', isScrolling);
    return () => window.removeEventListener('scroll', isScrolling);
  }, []);

  React.useEffect(() => {
    if (isBottom && items.total_page >= filters.page && !isLoading) {
      setIsBottom(false);
      fetchData({ page: filters.page + 1 });
    }
  }, [fetchData, filters, isBottom, items, isLoading]);

  React.useEffect(() => {
    if (isMounted.current) {
      if (debouncedValue?.length > 2) {
        setFilters((prevState) => ({ ...prevState, page: 1, title: debouncedValue }));
        addQueryParams('term', debouncedValue, history);
      } else {
        setFilters((prevState) => omit({ ...prevState, page: 1 }, 'title'));
        removeQueryParams('term', history);
      }
    }
  }, [debouncedValue, history]);

  React.useEffect(() => {
    getData();
  }, [getData, isLoading]);

  React.useEffect(() => {
    if (isMounted.current) {
      updateAdvanceFilters();
    }
  }, [updateAdvanceFilters]);

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    }
  }, []);

  // if userStore.user and create is both true then open the createModal
  React.useEffect(() => {
    userStore?.user && create && handleToggle({ createModal: true });
  }, [create, handleToggle, userStore.user]);

  return (
    <>
      <main id="all-topics" className="container wrapper lg:flex customer-cases-listing">
        <div className="hidden lg:mr-16 sidebar lg:block">
          <div className="sidebar-sticky-margin">
            <Filters methods={methods} onChangeInput={onChangeInput} searchDefaultValue={debouncedValue}>
              <button className="block w-full btn btn-outline" type="button" onClick={onReset} data-cy="reset_btn">
                Reset
              </button>
            </Filters>
          </div>
        </div>
        <div className="flex items-center justify-end mb-8 lg:hidden"></div>
        <div className="w-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Customer Cases</h2>
            <div className="flex">
              <button
                onClick={() => handleToggle({ filterModal: true })}
                className="inline-block text-xs btn btn-outline lg:hidden"
              >
                <i className="icon-view-all material-icons md-16 md:mr-1">search</i>
                Show Filters
              </button>
              <button className="ml-2 btn btn-primary" onClick={onClickCreateButton}>
                Create Cases
              </button>
            </div>
          </div>
          {!!items.data.length && (
            <div className="mb-12 grid gap-6 lg:grid-cols-3 md:grid-cols-3 xs:grid-cols-2">
              {items?.data?.map((item) => (
                <Card key={item.wp_id} data={item} methods={methods} />
              ))}
              {isLoading && <Skeleton />}
            </div>
          )}
          {items?.data?.length < 1 && !isLoading && <h1>No results found.</h1>}
          {isLoading && (
            <div className="flex items-center justify-center">
              <Loading />
            </div>
          )}
        </div>
      </main>
      {toggle.createModal && (
        <Create
          onToggle={(show) => {
            handleToggle({ createModal: show || !toggle.createModal });
          }}
        />
      )}
      {toggle.filterModal && (
        <Modal
          size="sm"
          containerClass="bg-secondary overflow-y-auto"
          className="lg:hidden"
          onToggle={onToggleFilterModal}
        >
          <div className="p-8">
            <ModalHeader onToggle={onToggleFilterModal}>Search Customer Cases</ModalHeader>
            <Filters methods={methods} onChangeInput={onChangeInput} searchDefaultValue={debouncedValue}>
              <div className="grid grid-cols-2 gap-4">
                <button className="btn btn-outline" type="button" onClick={onReset}>
                  Reset
                </button>
                <button className="btn btn-outline" type="button" onClick={onToggleFilterModal}>
                  View Results
                </button>
              </div>
            </Filters>
          </div>
        </Modal>
      )}
    </>
  );
};

export default inject(({ customerCaseStore, userStore }) => ({ customerCaseStore, userStore }))(
  observer(CustomerCases)
);
