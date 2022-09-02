import { addQueryParams, removeQueryParams } from 'utils';
import { inject, observer } from 'mobx-react';
import { removeEmpty } from 'utils';
import Breadcrumb from 'components/common/Breadcrumb';
import cx from 'classnames';
import DashboardSectionList from '../../DashboardSectionList';
import Emails from './Tables/Emails';
import Ips from './Tables/Ips';
import Loading from 'components/common/Loading';
import MobileDropdownButton from 'components/common/MobileDropdownButton';
import MobileMenu from 'components/Profile/MobileMenu';
import qs from 'query-string';
import React from 'react';
import Search from './Tables/Search';
import Staff from './Tables/Staff';
import Tabs from 'components/common/Tabs';
import Urls from './Tables/Urls';
import useToggle from 'hooks/useToggle';

const TABS = [
  { value: 'staff', label: 'Staff Actions', 'data-cy': 'tab_staff' },
  { value: 'emails', label: 'Screened Emails', 'data-cy': 'tab_emails' },
  { value: 'ip', label: 'Screened IPs', 'data-cy': 'tab_ip' },
  { value: 'url', label: 'Screened URLs', 'data-cy': 'tab_url' },
  { value: 'search', label: 'Search logs', 'data-cy': 'tab_search' },
  // { value: 'error', label: 'Error Logs', 'data-cy': 'tab_error' },
];

const Logs = ({ logStore, history }) => {
  const { tab, term } = qs.parse(history.location.search);
  const [selectedTab, setSelectedTab] = React.useState(tab || 'staff');
  const [advanceFilters, setAdvanceFilters] = React.useState(
    selectedTab === 'staff' ? { subject: term } : { email: term }
  );
  const [items, setItems] = React.useState({ data: [] });
  const [isBottom, setIsBottom] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [filters, setFilters] = React.useState({
    pageSize: 15,
    pageIndex: 1,
  });
  const { toggle, handleToggle } = useToggle({ mobileMenu: false });

  const getData = React.useCallback(async () => {
    setIsLoading(true);
    const payload = { ...advanceFilters, page: filters.pageIndex, limit: filters.pageSize };

    const apiEndpoint =
      selectedTab === 'staff'
        ? logStore.getAllModeration
        : selectedTab === 'emails'
        ? logStore.getEmails
        : selectedTab === 'ip'
        ? logStore.getIp
        : selectedTab === 'url'
        ? logStore.getUrl
        : selectedTab === 'search'
        ? logStore.getAllSearch
        : selectedTab === 'error'
        ? logStore.getIp
        : logStore.getAllModeration;

    apiEndpoint(removeEmpty(payload)).then((res) => {
      setItems((prevState) => {
        const { data, ...rest } = prevState;

        return {
          ...rest,
          ...res,
          data: [
            ...data,
            ...res.data.map((i) => ({
              ...i.document,
              ...i,
            })),
          ],
        };
      });
      setIsLoading(false);
    });
  }, [logStore, advanceFilters, filters.pageIndex, filters.pageSize, selectedTab]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  React.useEffect(() => {
    if (advanceFilters?.title) {
      addQueryParams('term', advanceFilters?.title, history);
    } else {
      removeQueryParams('term', history);
    }
  }, [advanceFilters, history]);

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

  const onChangeAdvanceFilters = (data) => {
    setFilters({ pageIndex: 1, pageSize: 20 });
    setItems({ data: [] });
    setAdvanceFilters(data);
  };

  const onChangeTab = (tab) => {
    setFilters({ pageIndex: 1, pageSize: 10 });
    setItems({ data: [] });
    setSelectedTab(tab);
  };

  React.useEffect(() => {
    window.addEventListener('scroll', isScrolling);
    return () => window.removeEventListener('scroll', isScrolling);
  }, []);

  React.useEffect(() => {
    if (isBottom && items.total_page >= filters.pageIndex && !isLoading) {
      setIsBottom(false);
      fetchData({ pageIndex: filters.pageIndex + 1 });
    }
  }, [fetchData, filters.pageIndex, isBottom, items.total_page, isLoading]);

  return (
    <>
      <main className="container wrapper lg:flex">
        <DashboardSectionList isAdmin className="hidden lg:block" />
        <div className="flex-grow">
          <Breadcrumb title={`Logs`} className="mb-8" />
          <MobileMenu isAdmin title="Logs" />
          <input
            className="flex w-full mt-6 mb-16 input-search"
            type="text"
            placeholder="Search"
            onChange={(e) =>
              onChangeAdvanceFilters(
                selectedTab === 'staff'
                  ? { subject: e.target.value }
                  : selectedTab === 'emails'
                  ? { email: e.target.value }
                  : selectedTab === 'ip'
                  ? { ip_address: e.target.value }
                  : selectedTab === 'url'
                  ? { domain: e.target.value }
                  : selectedTab === 'search'
                  ? { term: e.target.value }
                  : { subject: e.target.value }
              )
            }
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
          <div className="overflow-auto">
            {selectedTab !== 'search' && selectedTab !== 'error' && (
              <div className="font-semibold">Total: {items.total} logs</div>
            )}
            <table className="table w-full">
              {selectedTab === 'staff' && <Staff items={items} />}
              {selectedTab === 'emails' && <Emails items={items} />}
              {selectedTab === 'ip' && <Ips items={items} />}
              {selectedTab === 'url' && <Urls items={items} />}
              {selectedTab === 'search' && <Search items={items} />}
            </table>
            {isLoading && <Loading />}
          </div>
        </div>
      </main>
    </>
  );
};

export default inject(({ userStore, logStore }) => ({ userStore, logStore }))(observer(Logs));
