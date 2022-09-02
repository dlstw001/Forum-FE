import { addQueryParams, removeQueryParams } from 'utils';
import { dateFormat } from 'utils';
import { inject, observer } from 'mobx-react';
import { isEqual } from 'lodash';
import { removeEmpty } from 'utils';
import { useForm } from 'react-hook-form';
import Breadcrumb from 'components/common/Breadcrumb';
import cx from 'classnames';
import DashboardSectionList from '../../DashboardSectionList';
import DatePickerModal from 'components/common/modals/DateRangeModal';
import Loading from 'components/common/Loading';
import MembersTablePaginated from './MembersTablePaginated';
import MobileDropdownButton from 'components/common/MobileDropdownButton';
import MobileMenu from 'components/Profile/MobileMenu';
import qs from 'query-string';
import React from 'react';
import Tabs from 'components/common/Tabs';
import useDebounce from 'hooks/useDebounce';
import useToggle from 'hooks/useToggle';

const TABS = [
  { value: 'all', label: 'All', 'data-cy': 'tab_all' },
  { value: 'admin', label: 'Admin', 'data-cy': 'tab_admin' },
  { value: 'moderator', label: 'Moderator', 'data-cy': 'tab_moderator' },
  { value: 'leader', label: 'Community Leader', 'data-cy': 'tab_leader' },
  { value: 'new', label: 'New', 'data-cy': 'tab_new' },
  { value: 'suspended', label: 'Suspended', 'data-cy': 'tab_suspended' },
  { value: 'silenced', label: 'Silenced', 'data-cy': 'tab_silenced' },
];

const Members = ({ userStore, history }) => {
  const { tab, term } = qs.parse(history.location.search);
  const [items, setItems] = React.useState({ data: [] });
  const [selectedTab, setSelectedTab] = React.useState(tab || 'all');

  const [isLoading, setIsLoading] = React.useState(false);
  const methods = useForm({
    defaultValues: {
      from: '2020-01-01',
      to: dateFormat(new Date(), 'yyyy-MM-dd'),
    },
  });
  const { watch } = methods;
  const { from, to } = watch();
  const [filters, setFilters] = React.useState({
    pageSize: 25,
    pageIndex: 0,
    sortBy: [{ id: 'createdAt', desc: true }],
    displayName: term,
  });

  const [displayName, setDisplayName] = React.useState(null);
  const debouncedValue = useDebounce(displayName, 750);

  const sortingParams = React.useMemo(() => {
    switch (selectedTab) {
      case 'admin':
        return { admin: true };
      case 'moderator':
        return { moderator: true };
      case 'leader':
        return { leader: true };
      case 'new':
        return { new: true };
      case 'suspended':
        return { suspended: true };
      case 'silenced':
        return { silenced: true };
      default:
        return {};
    }
  }, [selectedTab]);

  const { handleToggle, toggle } = useToggle({
    datePicker: false,
  });

  const getData = React.useCallback(async () => {
    const { sorting, sortBy } = filters;
    const order_by = sorting?.order_by ? sorting?.order_by : sortBy?.[0]?.desc ? 'desc' : 'asc';

    const payload = {
      ...sortingParams,
      displayName: filters.displayName,
      from: filters.from,
      to: filters.to,
      page: filters.pageIndex + 1,
      limit: filters.pageSize,
      sort_by: sorting?.sort_by || sortBy?.[0]?.id,
      order_by: order_by,
    };

    setIsLoading(true);
    await userStore.find(removeEmpty(payload)).then((res) => {
      setItems(res);
      setIsLoading(false);
    });
  }, [filters, sortingParams, userStore]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  React.useEffect(() => {
    if (filters?.displayName) {
      addQueryParams('term', filters?.displayName, history);
    } else {
      removeQueryParams('term', history);
    }
  }, [filters, history]);

  const fetchData = React.useCallback((options) => {
    setFilters((prevState) => {
      // If the sorting was changed, return to page 1.
      if (isEqual(prevState?.sorting, options?.sorting)) {
        return { ...prevState, ...options };
      } else {
        return { ...prevState, ...options, pageIndex: 0 };
      }
    });
  }, []);

  const onChangeFilters = React.useCallback((data) => {
    setFilters({ pageIndex: 0, pageSize: 25, ...data });
    setItems({ data: [] });
  }, []);

  const onChangeTab = (tab) => {
    setFilters({ pageIndex: 0, pageSize: 25 });
    setItems({ data: [] });
    setSelectedTab(tab);
  };

  React.useEffect(() => {
    if (debouncedValue !== null) {
      onChangeFilters({ displayName: debouncedValue });
    }
  }, [debouncedValue, onChangeFilters]);

  return (
    <>
      <main className="container wrapper lg:flex">
        <DashboardSectionList isAdmin className="hidden lg:block" />
        <div className="flex-grow">
          <Breadcrumb title={`Community Members`} className="mb-8" />
          <MobileMenu isAdmin title="Community Members" />
          <input
            className="flex w-full mt-6 mb-16 input-search"
            type="text"
            placeholder="Search"
            onChange={(e) => setDisplayName(e.target.value)}
            data-cy="search"
          />
          <MobileDropdownButton
            title={TABS.find((i) => i.value === selectedTab).label}
            isOpen={toggle.mobileMenu}
            onToggle={() => handleToggle({ mobileMenu: !toggle.mobileMenu })}
          />
          <div className={cx('p-4 lg:p-0 mb-8 bg-gray-50 lg:bg-transparent lg:block', { hidden: !toggle.mobileMenu })}>
            <div className="flex mb-4 lg:hidden">
              <button onClick={() => handleToggle({ mobileMenu: false })} className="ml-auto material-icons">
                close
              </button>
            </div>
            <Tabs tabs={TABS} current={selectedTab} onClick={(val) => onChangeTab(val)} />
          </div>
          <div className="flex">
            <div className="font-semibold">Total: {items.total} users</div>
            <div className="ml-auto">
              <div className="flex items-center justify-center cursor-pointer">
                <h3 className="datepicker-title">Month</h3>
                <h3 className="datepicker-date" onClick={() => handleToggle({ datePicker: !toggle.datePicker })}>
                  {dateFormat(filters.from || from) + ' - ' + dateFormat(filters.to || to)}
                </h3>
                <i className="mr-1 text-gray-200 material-icons">keyboard_arrow_down</i>
              </div>
              {toggle.datePicker && (
                <DatePickerModal
                  onToggle={(show) => {
                    handleToggle({ datePicker: show || !toggle.datePicker });
                  }}
                  onSubmit={onChangeFilters}
                  data={{ from: filters.from || from, to: filters.to || to }}
                  methods={methods}
                />
              )}
            </div>
          </div>
          <MembersTablePaginated data={items} fetchData={fetchData} filters={filters} />
          {isLoading && <Loading />}
        </div>
      </main>
    </>
  );
};

export default inject(({ postStore, userStore }) => ({ postStore, userStore }))(observer(Members));
