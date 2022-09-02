import { first, uniqBy } from 'lodash';
import { inject, observer } from 'mobx-react';
import { removeEmpty } from 'utils';
import { ROUTES } from 'definitions';
import Breadcrumb from 'components/common/Breadcrumb';
import Dropdown from 'components/common/Dropdown';
import HottestTopicsList from 'components/common/HottestTopicsList';
import Loading from 'components/common/Loading';
import qs from 'query-string';
import React from 'react';
import SettingsPopup from 'components/common/SettingsPopup';
import Sorting from 'components/common/Sorting';
import TopicItem from 'components/common/TopicItem';
import TrendingSectionList from 'components/common/TrendingSectionList';

const TABS = [
  { value: 'activity', label: 'Last Activity' },
  { value: 'hottest', label: 'Trending' },
  { value: 'newest', label: 'Latest' },
  { value: 'favourites', label: 'Most Favourites' },
  { value: 'views', label: 'Most Views' },
  { value: 'discussed', label: 'Most Discussed' },
  { value: 'unread', label: 'Unread' },
  //{ value: 'following', label: 'Following' },
];

const Topics = ({ postStore, userStore, history, tagStore }) => {
  const { tab, tag } = qs.parse(history.location.search);
  const [items, setItems] = React.useState({ data: [] });
  const [selectedTab, setSelectedTab] = React.useState(tab || 'activity');
  const [selectedTag, setSelectedTag] = React.useState(tag || null);
  const [isBottom, setIsBottom] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [filters, setFilters] = React.useState({
    pageSize: 10,
    pageIndex: 1,
  });
  const [watching, setWatching] = React.useState({ id: '', label: '', icon: '' });

  const arrayTags = React.useMemo(() => {
    return selectedTag;
  }, [selectedTag]);

  const sortingParams = React.useMemo(() => {
    switch (selectedTab) {
      case 'activity':
        return { sort_by: 'lastModified', order_by: 'desc', tags: arrayTags };
      case 'newest':
        return { sort_by: 'createdAt', order_by: 'desc', tags: arrayTags };
      case 'favourites':
        return { sort_by: 'noLikes', order_by: 'desc', tags: arrayTags };
      case 'views':
        return { sort_by: 'views', order_by: 'desc', tags: arrayTags };
      case 'discussed':
        return { sort_by: 'noContributors', order_by: 'desc', tags: arrayTags };
      case 'unread':
      case 'following':
      case 'hottest':
      default:
        return { sort_by: 'lastModified', order_by: 'desc', tags: arrayTags };
    }
  }, [selectedTab, arrayTags]);

  const getData = React.useCallback(async () => {
    setIsLoading(true);
    const payload = {
      ...sortingParams,
      page: filters.pageIndex,
      limit: filters.pageSize,
    };

    const apiEndpoint =
      selectedTab === 'hottest'
        ? postStore.hot
        : selectedTab === 'unread'
        ? postStore.unread
        : selectedTab === 'following'
        ? postStore.myBookmarkList
        : postStore.find;

    apiEndpoint(removeEmpty(payload))
      .then((res) => {
        // setItems(res);
        setItems((prevState) => {
          const { data, ...rest } = prevState;

          return {
            ...rest,
            ...res,
            data: uniqBy(
              [
                ...data,
                ...res.data.map((i) => ({
                  ...i.document,
                  ...i,
                })),
              ],
              '_id'
            ),
          };
        });
      })
      .finally(() => setIsLoading(false));
  }, [postStore, filters.pageIndex, filters.pageSize, selectedTab, sortingParams]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  const onChangeTab = (tab) => {
    setFilters({ pageIndex: 1, pageSize: 10 });
    setItems({ data: [] });
    setSelectedTab(tab);
  };

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

  const reset = () => {
    setFilters({ pageIndex: 1, pageSize: 10 });
    setItems({ data: [] });
  };

  const notificationSettings = async (val) => {
    const { notifications, ...rest } = userStore?.user;
    const { tags, ...restNotifications } = notifications;

    const payload = {
      ...rest,
      notifications: {
        ...restNotifications,
        tags: [...tags.filter((item) => item.tag !== watching.id), { tag: watching.id, lv: val }],
      },
    };

    await userStore.updateMe(payload).then(() =>
      setWatching({
        label: NOTIFICATIONLVL[val].name,
        icon: NOTIFICATIONLVL[val].icon,
        id: watching.id,
      })
    );
  };

  React.useEffect(() => {
    if (userStore?.user && tag) {
      const notificationTags = userStore?.user ? userStore?.user?.notifications?.tags : [];

      tagStore.find({ name: tag }).then(({ data }) => {
        const tag = first(data);
        const watchingStatus = notificationTags.find((item) => item.tag === tag._id) || { lv: 1 };

        setWatching({
          label: NOTIFICATIONLVL[watchingStatus.lv].name,
          icon: NOTIFICATIONLVL[watchingStatus.lv].icon,
          id: tag._id,
        });
      });
    }
  }, [tag, tagStore, userStore.user]);

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

  React.useEffect(() => {
    setSelectedTab(tab);
    setSelectedTag(tag);
    reset();
  }, [tab, tag]);

  return (
    <>
      <main id="all-topics" className="container wrapper lg:flex">
        <div className="hidden mr-16 sidebar lg:block">
          <TrendingSectionList />
          <div className="sticky-trend-topics">
            <HottestTopicsList />
          </div>
        </div>
        <div className="w-full">
          <Breadcrumb
            between={tag && { title: 'All Topics', link: `${ROUTES.TOPIC}` }}
            title={tag ? `${tag}` : `All Topics`}
            className="mb-8"
          />
          <div className="flex items-center">
            <Sorting
              tabs={userStore.user ? TABS : TABS.filter((i) => i.value !== 'unread' && i.value !== 'following')}
              current={selectedTab}
              onClick={onChangeTab}
            />

            {userStore?.user && (
              <Dropdown
                placement="bottom-end"
                menuClassname="text-black action-menu mt-2"
                className="items-center h-full ml-auto"
                menu={({ style }) => (
                  <SettingsPopup style={style} options={NOTIFICATIONLVL} onClick={notificationSettings} />
                )}
              >
                <button className="leading-none text-black btn btn-action">
                  <i className="material-icons">{watching.icon}</i>
                </button>
              </Dropdown>
            )}
          </div>

          <div className="mt-12">
            {items.data.map((item, index) => (
              <TopicItem key={item._id} data={item} list={items.data} index={index} />
            ))}
            {items?.data?.length < 1 && !isLoading && <h1>No Topics</h1>}
            {isLoading && <Loading />}
          </div>
        </div>
      </main>
    </>
  );
};

export default inject(({ postStore, userStore, tagStore }) => ({ postStore, userStore, tagStore }))(observer(Topics));

const NOTIFICATIONLVL = [
  {
    label: 'Muted',
    name: 'Mute',
    description:
      'You will not be notified of anything about new topics with these tags, and they will not appear in latest.',
    icon: 'notifications_off',
    value: 0,
    visible: true,
    order: 1,
  },
  {
    label: 'Normal',
    name: 'Normal',
    description: 'You will be notified if someone mentions your @name or replies to you.',
    icon: 'notifications_none',
    value: 1,
    visible: true,
    order: 2,
  },
  {
    label: 'Tracking',
    name: 'Tracking',
    description:
      'A count of new replies will be shown for this topic. You will be notified if someone mentions your @name or replies to you.',
    icon: 'notifications',
    value: 2,
    visible: false,
    order: -1,
  },
  {
    label: 'Watched',
    name: 'Watched',
    description:
      'You will automatically watch all topics in these tags. You will be notified of all new posts and topics, and a count of new posts will also appear next to the topic.',
    value: 3,
    icon: 'notification_important',
    visible: true,
    order: 4,
  },
  {
    label: 'Watching First Post',
    name: 'Watching First Post',
    description: 'You will be notified of the first post in each new topic in these tags.',
    icon: 'notifications',
    value: 4,
    visible: true,
    order: 3,
  },
];
