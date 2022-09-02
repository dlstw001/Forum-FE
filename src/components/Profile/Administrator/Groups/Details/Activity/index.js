import { inject, observer } from 'mobx-react';
import { removeEmpty } from 'utils';
import cx from 'classnames';
import Loading from 'components/common/Loading';
import Mentions from './Mentions';
import MobileDropdownButton from 'components/common/MobileDropdownButton';
import React from 'react';
import Replies from './Replies';
import SideTabs from 'components/Profile/Administrator/Groups/Details/Activity/SideTabs';
import Topics from './Topics';
import useToggle from 'hooks/useToggle';

const TABS = [
  { value: 'topic', label: 'Topic', 'data-cy': 'tab_staff' },
  { value: 'replies', label: 'Replies', 'data-cy': 'tab_emails' },
  // { value: 'mentions', label: 'Mentions', 'data-cy': 'tab_ip' },
];

const Activity = ({ groupStore, id }) => {
  const [selectedTab, setSelectedTab] = React.useState('topic');
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
    const payload = { page: filters.pageIndex, limit: filters.pageSize };

    const apiEndpoint =
      selectedTab === 'topic'
        ? groupStore.getAcitivityTopics
        : selectedTab === 'replies'
        ? groupStore.getAcitivityReplies
        : selectedTab === 'mentions'
        ? groupStore.getActivityMentions
        : groupStore.getAcitivityTopics;

    apiEndpoint(id, removeEmpty(payload)).then((res) => {
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
  }, [groupStore, id, filters.pageIndex, filters.pageSize, selectedTab]);

  React.useEffect(() => {
    getData();
  }, [getData]);

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
          <SideTabs tabs={TABS} current={selectedTab} onClick={(val) => onChangeTab(val)} />
        </div>

        <div>
          {selectedTab === 'topic' && <Topics items={items} />}
          {selectedTab === 'replies' && <Replies items={items} />}
          {selectedTab === 'mentions' && <Mentions items={items} />}
          {items?.data?.length < 1 && !isLoading && (
            <p>
              No {selectedTab === 'topic' ? 'Topics' : selectedTab === 'replies' ? 'Replies' : 'Mentions'} Available
            </p>
          )}
          {isLoading && <Loading />}
        </div>
      </main>
    </>
  );
};

export default inject(({ groupStore }) => ({ groupStore }))(observer(Activity));
