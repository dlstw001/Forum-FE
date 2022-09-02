import { defaultItems } from 'stores/post';
import { inject, observer } from 'mobx-react';
import { LOGIN_URL, ROUTES } from 'definitions';
import { useInView } from 'react-intersection-observer';
import Breadcrumb from 'components/common/Breadcrumb';
import CategoryCard from 'components/common/TrendingSectionItem';
import CategoryItem from '../CategoryItem';
import CreateSectionModal from 'components/common/modals/SectionModal';
import Dropdown from 'components/common/Dropdown';
import HottestTagsList from 'components/common/HottestTagsList';
import HottestTopicsList from 'components/common/HottestTopicsList';
import Loading from 'components/common/Loading';
import qs from 'query-string';
import React from 'react';
import ReminderModal from 'components/common/modals/ReminderModal';
import SettingsPopup from 'components/common/SettingsPopup';
import Sorting from 'components/common/Sorting';
import TopicItem from 'components/common/TopicItem';
import TopicModal from 'components/common/modals/TopicModal';
import TrendingSectionList from 'components/common/TrendingSectionList';
import useToggle from 'hooks/useToggle';

const TABS = [
  { value: 'activity', label: 'Last Activity' },
  { value: 'hottest', label: 'Trending' },
  { value: 'newest', label: 'Latest' },
  { value: 'favourites', label: 'Most Favourites' },
  { value: 'views', label: 'Most Views' },
  { value: 'discussed', label: 'Most Discussed' },
  // { value: 'unread', label: 'Unread' },
];

const CategoryDetails = ({ postStore, categoryStore, userStore, match, history }) => {
  const { id } = match.params;
  const { tab } = qs.parse(history.location.search);
  const [selectedTab, setSelectedTab] = React.useState(tab || postStore.sort || 'latest');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isReady, setIsReady] = React.useState();
  const [watching, setWatching] = React.useState({});
  const { handleToggle, toggle } = useToggle({
    editSectionModal: false,
    deleteSectionModal: false,
    createTopicModal: false,
  });
  const [filters, setFilters] = React.useState({
    pageSize: 10,
    pageIndex: 1,
  });

  const [refView, inView] = useInView({
    threshold: 1,
    initialInView: false,
    rootMargin: '200px 0px',
  });

  React.useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 1000);
  }, []);

  React.useEffect(() => {
    const setScrollPosition = () => {
      sessionStorage.setItem('scroll', document.scrollingElement.scrollTop);
    };
    window.addEventListener('scroll', setScrollPosition);
    return () => {
      window.removeEventListener('scroll', setScrollPosition);
    };
  }, [history]);

  React.useEffect(() => {
    const action = history.action;
    const scroll = sessionStorage.getItem('scroll');

    if (scroll && action === 'POP') {
      window.scrollTo(0, scroll);
      sessionStorage.removeItem('scroll');
    } else if (action === 'PUSH') {
      window.scrollTo(0, 0);
      postStore.items = defaultItems();
    }
  }, [history.action, id, postStore]);

  const sortingParams = React.useMemo(() => {
    switch (selectedTab) {
      case 'latest':
        return { sort_by: 'lastModified', order_by: 'desc' };
      case 'newest':
        return { sort_by: 'createdAt', order_by: 'desc' };
      case 'views':
        return { sort_by: 'views', order_by: 'desc' };
      case 'discussed':
        return { sort_by: 'noContributors', order_by: 'desc' };
      case 'favourites':
        return { sort_by: 'noLikes', order_by: 'desc' };
      case 'unread':
      case 'hottest':
      default:
        return {};
    }
  }, [selectedTab]);

  const getData = React.useCallback(async () => {
    if (!filters.category) return false;

    setIsLoading(true);

    const payload = {
      ...sortingParams,
      page: filters.pageIndex,
      limit: filters.pageSize,
      category: filters.category,
    };
    let method = postStore.find;
    switch (selectedTab) {
      case 'hottest':
        method = postStore.hot;
        break;
      case 'unread':
        method = postStore.unread;
        break;
      default:
        break;
    }
    await method(payload);
    setIsLoading(false);
  }, [
    filters.category,
    filters.pageIndex,
    filters.pageSize,
    postStore.find,
    postStore.hot,
    postStore.unread,
    selectedTab,
    sortingParams,
  ]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  React.useEffect(() => {
    const id = match.params.id;
    const getCategory = async (id) => {
      categoryStore.get(id);
    };
    getCategory(id);
  }, [categoryStore, match.params.id]);

  const fetchData = React.useCallback((options) => {
    setFilters((prevState) => ({ ...prevState, ...options }));
  }, []);

  React.useEffect(() => {
    const { _id } = categoryStore.data.item;
    if (_id) {
      fetchData({ category: _id, pageIndex: 1, pageSize: 10 });
    }
  }, [categoryStore.data.item, fetchData]);

  const onCatUpdate = () => {
    fetchData({ pageIndex: 1 });
  };

  const onChangeTab = (tab) => {
    postStore.sort = tab;
    fetchData({ pageIndex: 1, pageSize: 10 });
    setSelectedTab(tab);
  };

  React.useEffect(() => {
    const { next_page, current_page, total_page } = postStore.items;
    if (inView && next_page && current_page <= total_page) {
      setIsLoading(true);
      fetchData({ pageIndex: next_page });
    }
  }, [fetchData, inView, postStore, postStore.items]);

  const notificationSettings = async (val) => {
    const { notifications, ...rest } = userStore?.user;
    const { categories, ...restNotifications } = notifications;
    const payload = {
      ...rest,
      notifications: {
        ...restNotifications,
        categories: [
          ...categories.filter((item) => item.category !== categoryStore.data.item._id),
          { category: categoryStore.data.item._id, lv: val },
        ],
      },
    };

    await userStore.updateMe(payload).then(() =>
      setWatching({
        label: NOTIFICATIONLVL[val].name,
        icon: NOTIFICATIONLVL[val].icon,
      })
    );
  };

  React.useEffect(() => {
    const notificationCategories = userStore?.user ? userStore?.user?.notifications?.categories : [];
    const categoryID = categoryStore.data.item._id || '';
    const watchingStatus = notificationCategories.find((item) => item.category === categoryID) || { lv: 1 };

    setWatching({
      label: NOTIFICATIONLVL[watchingStatus.lv].name,
      icon: NOTIFICATIONLVL[watchingStatus.lv].icon,
    });
  }, [categoryStore.data.item._id, userStore.user]);

  const handleClickCreateTopic = () => {
    if (!isReady) return;

    if (userStore.user) {
      handleToggle({ createTopicModal: !toggle.createTopicModal });
    } else {
      window.location.href = LOGIN_URL;
    }
  };

  const handleCleanup = (redirectUrl) => {
    handleToggle({ createTopicModal: false });
    if (redirectUrl) {
      history.push(redirectUrl);
    }
  };

  return (
    <>
      <main className="container mx-auto mt-8 lg:flex lg:mt-16">
        <div className="hidden sidebar lg:px-4 lg:block">
          <TrendingSectionList />
          <div className="sticky-trend-topics">
            <HottestTopicsList />
            <HottestTagsList id={categoryStore.data.item._id} />
          </div>
        </div>
        <div className="w-full px-4">
          <div id="section-title-wrapper" className="pb-4 mb-4">
            <Breadcrumb
              between={
                categoryStore.data.item.parent && {
                  title: `${categoryStore.data.item.parent.name}`,
                  link: `${ROUTES.CATEGORY_DETAILS}/${categoryStore.data.item.parent.slug}`,
                }
              }
              title={categoryStore.data.item.name}
              link={`${ROUTES.CATEGORY_DETAILS}/${categoryStore.data.item.slug}`}
              className="mb-8"
            />
            <div className="flex items-center">
              <h1 className="mb-4 category-title">{categoryStore.data.item.name}</h1>
              <p className="cat-description">{categoryStore.data.desc}</p>
              {userStore?.user && (
                <Dropdown
                  placement="bottom-end"
                  menuClassname="text-black action-menu mt-2"
                  className="items-center h-full mb-5 ml-auto"
                  menu={({ style }) => (
                    <SettingsPopup style={style} options={NOTIFICATIONLVL} onClick={notificationSettings} />
                  )}
                >
                  <button className="leading-none text-black btn btn-action">
                    <i className="material-icons">{watching.icon}</i>
                  </button>
                </Dropdown>
              )}

              {userStore.IS_ADMIN_OR_MODERATOR && (
                <Dropdown
                  placement="bottom-end"
                  menuClassname="action-menu"
                  className="flex items-center h-full"
                  menu={({ style }) => (
                    <ul className="text-gray-500 bg-secondary menu" style={style}>
                      <li>
                        <button
                          onClick={() => handleToggle({ editSectionModal: !toggle.editSectionModal })}
                          data-cy="edit_sections_btn"
                          className="capitalize"
                        >
                          Edit Category
                        </button>
                      </li>

                      {categoryStore.data &&
                        categoryStore.data.item &&
                        categoryStore.data.item.childCategories &&
                        categoryStore?.data?.item?.childCategories.length === 0 && (
                          <li>
                            <button
                              onClick={() => handleToggle({ deleteSectionModal: !toggle.deleteSectionModal })}
                              data-cy="delete_sections_btn"
                              className="capitalize"
                            >
                              Delete Category
                            </button>
                          </li>
                        )}
                    </ul>
                  )}
                >
                  <i className="mb-4 ml-auto material-icons btn-action" data-cy="action_menu_dropdown">
                    more_vert
                  </i>
                </Dropdown>
              )}
            </div>
            <p>{categoryStore.data.item.desc}</p>
          </div>

          {!!categoryStore.data.item.childCategories?.length &&
            (categoryStore?.data?.item?.childCategories.some((i) => i?.image?.filename !== undefined) ? (
              <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
                {categoryStore.data.item.childCategories?.map((item) => (
                  <CategoryCard key={item._id} data={item} isClickable />
                ))}
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-4">
                <div>
                  {categoryStore.data.item.childCategories.map((item) => (
                    <CategoryItem key={item._id} data={item} isClickable />
                  ))}
                </div>
              </div>
            ))}
          <div className="flex items-center flex-grow-0 mt-8 mb-16">
            <Sorting tabs={TABS} current={selectedTab} onClick={onChangeTab} />
            {categoryStore?.data?.item?.canPost && (
              <button
                className="flex items-center ml-auto btn btn-primary"
                onClick={handleClickCreateTopic}
                data-cy="create_topic_modal"
              >
                <span className="hidden md:block">Create Topics</span>
                <span className="block md:hidden">Create</span>
              </button>
            )}
          </div>
          <div className="mt-4">
            {postStore.items.data.map((item, index) => (
              <TopicItem key={item._id} data={item} list={postStore.items.data} index={index} />
            ))}
            {/* {items?.data?.length < 1 && !isLoading && <h1>No results found.</h1>} */}
            <div ref={isReady && refView}>{isLoading && <Loading />}</div>
          </div>
        </div>
      </main>
      {toggle.editSectionModal && (
        <CreateSectionModal
          data={categoryStore.data.item}
          onToggle={(show) => {
            handleToggle({ editSectionModal: show || !toggle.editSectionModal });
          }}
          onSuccess={onCatUpdate}
          isParent={false}
        />
      )}
      {toggle.deleteSectionModal && (
        <ReminderModal
          onToggle={() => handleToggle({ deleteSectionModal: !toggle.deleteSectionModal })}
          message={'Are you sure you want to delete a category?'}
          onHandle={() => categoryStore.delete(categoryStore.data.item._id).then(() => history.push(ROUTES.CATEGORIES))}
        />
      )}
      {toggle.createTopicModal && (
        <TopicModal
          defaultCategorySlug={id}
          onToggle={(show) => {
            handleToggle({ createTopicModal: show || !toggle.createTopicModal });
          }}
          onCleanup={handleCleanup}
        />
      )}
    </>
  );
};

export default inject(({ postStore, categoryStore, userStore }) => ({ postStore, categoryStore, userStore }))(
  observer(CategoryDetails)
);

export const NOTIFICATIONLVL = [
  {
    label: 'Muted',
    name: 'Mute',
    description:
      'You will not be notified of anything about new topics in these categories, and they will not appear on the categories or latest pages.',
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
      'You will automatically watch all topics in these categories. You will be notified of all new posts and topics, and a count of new posts will also appear next to the topic.',
    value: 3,
    icon: 'notification_important',
    visible: true,
    order: 4,
  },
  {
    label: 'Watching First Post',
    name: 'Watching First Post',
    description: 'You will be notified of the first post in each new topic in these categories.',
    icon: 'notifications',
    value: 4,
    visible: true,
    order: 3,
  },
];
