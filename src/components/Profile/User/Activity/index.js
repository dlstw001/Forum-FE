import { inject, observer } from 'mobx-react';
import { isEmpty, toLower } from 'lodash';
import { Redirect } from 'react-router-dom';
import { removeEmpty } from 'utils';
import { ROUTES } from 'definitions';
import ActivityCard from './ActivityCard';
import Breadcrumb from 'components/common/Breadcrumb';
import cx from 'classnames';
import DashboardSectionList from '../../DashboardSectionList';
import Loading from 'components/common/Loading';
import MobileDropdownButton from 'components/common/MobileDropdownButton';
import MobileMenu from 'components/Profile/MobileMenu';
import qs from 'query-string';
import React from 'react';
import Tabs from 'components/common/Tabs';
import useToggle from 'hooks/useToggle';

const TABS = [
  { value: 'post', label: 'Post', 'data-cy': 'activity_post_tab' },
  { value: 'like', label: 'Like', 'data-cy': 'activity_like_tab' },
  { value: 'reply', label: 'Reply', 'data-cy': 'activity_reply_tab' },
  { value: 'topicViewed', label: 'Topic viewed' },
];

const Activity = ({ userStore, history, match }) => {
  const { term } = qs.parse(history.location.search);
  const { displayName } = match.params;
  const { toggle, handleToggle } = useToggle({ mobileMenu: false });
  const { tab } = qs.parse(history.location.search);
  const [selectedTab, setSelectedTab] = React.useState(tab || 'post');
  const [items, setItems] = React.useState({ data: [], total: 0 });
  const [isBottom, setIsBottom] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [canVisit, setCanVisit] = React.useState(true);
  const [filters, setFilters] = React.useState({
    pageSize: 10,
    pageIndex: 1,
  });
  const [advanceFilters, setAdvanceFilters] = React.useState({ title: term });

  const getData = React.useCallback(async () => {
    setIsLoading(true);
    const payload = { ...advanceFilters, page: filters.pageIndex, limit: filters.pageSize };

    const apiEndpoint =
      selectedTab === 'post'
        ? userStore.post
        : selectedTab === 'like'
        ? userStore.like
        : selectedTab === 'reply'
        ? userStore.reply
        : selectedTab === 'topicViewed'
        ? userStore.replyViewed
        : userStore.find;

    apiEndpoint(displayName, removeEmpty(payload)).then((res) => {
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
  }, [userStore, displayName, advanceFilters, filters.pageIndex, filters.pageSize, selectedTab]);

  React.useEffect(() => {
    userStore?.user &&
      (toLower(userStore.user.displayName) === displayName || userStore.IS_ADMIN_OR_MODERATOR) &&
      getData();
  }, [displayName, getData, userStore.IS_ADMIN_OR_MODERATOR, userStore.user]);

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

  const onChangeAdvanceFilters = (title) => {
    setFilters({ pageIndex: 1, pageSize: 20 });
    setItems({ data: [] });
    setAdvanceFilters(title);
  };

  React.useEffect(() => {
    if (!isEmpty(localStorage.getItem(process.env.REACT_APP_APP_NAME))) {
      userStore?.user &&
        setCanVisit(toLower(userStore.user.displayName) === displayName || userStore.IS_ADMIN_OR_MODERATOR);
    } else {
      setCanVisit(false);
    }
  }, [displayName, userStore.IS_ADMIN_OR_MODERATOR, userStore.user]);

  if (!canVisit) {
    return <Redirect to={ROUTES.NOT_FOUND} />;
  }

  return (
    <>
      <main className="container wrapper lg:flex">
        <DashboardSectionList displayName={displayName} className="hidden lg:block" />
        <div className="w-full">
          <Breadcrumb
            title={`Activity`}
            between={{ title: displayName, link: `${ROUTES.PROFILE}/${displayName}` }}
            className="mb-8"
          />
          <MobileMenu displayName={displayName} title="Activity" />

          <input
            className="flex w-full mb-4 input-search"
            type="text"
            placeholder="Search"
            onChange={(e) => onChangeAdvanceFilters({ title: e.target.value })}
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
          <div>
            {items.total === 0 && (
              <h2>
                {selectedTab === 'post'
                  ? 'No activity yet.'
                  : selectedTab === 'like'
                  ? 'No liked posts.'
                  : selectedTab === 'reply'
                  ? 'No replies.'
                  : 'No Viewed Replies'}
              </h2>
            )}

            {items.data.map((item) => (
              <ActivityCard key={item._id} data={item} />
            ))}
            {isLoading && <Loading />}
          </div>
        </div>
      </main>
    </>
  );
};

export default inject(({ userStore }) => ({ userStore }))(observer(Activity));
