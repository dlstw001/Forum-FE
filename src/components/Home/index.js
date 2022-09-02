import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { LOGIN_URL, ROUTES } from 'definitions';
import { TourContext } from 'context/TourContext.js';
//import CustomerCases from './CustomerCases.js';
import Loading from 'components/common/Loading';
import qs from 'query-string';
import React from 'react';
import TabMobileMenu from './TabMobileMenu';
import TabsForHome from './TabsInHome';
import TopicItem from 'components/common/TopicItem.js';
import TopicModal from 'components/common/modals/TopicModal.js';
import Tour from 'reactour';
// import TrendingSection from './TrendingSection.js';
import { debounce } from 'lodash-es';
import { defaultItems, TAB } from 'stores/post';
import { first } from 'lodash';
import { useInView } from 'react-intersection-observer';
import useToggle from 'hooks/useToggle';

const TABS = [
  { value: TAB.LATEST, label: 'Latest', 'data-cy': 'homepage_latest' },
  { value: TAB.TRENDING, label: 'Trending', 'data-cy': 'homepage_trending' },
  { value: TAB.UNREAD, label: 'Unread', 'data-cy': 'homepage_unread' },
];

const defaultTab = 'latest';
const Topics = ({ postStore, tagStore, userStore, draftStore, history }) => {
  const { tab, create } = qs.parse(history.location.search);
  const tour = React.useContext(TourContext);
  const [tagList, setTagList] = React.useState();
  const [isReady, setIsReady] = React.useState();
  const [draft, setDraft] = React.useState();

  const [refView, inView] = useInView({
    threshold: 1,
    delay: 1000,
    initialInView: false,
    rootMargin: '200px 0px',
  });

  React.useEffect(() => {
    postStore.selectedTab = tab || defaultTab;
  }, [postStore, tab]);

  React.useEffect(() => {
    const { action } = history;
    if (action === 'PUSH') {
      postStore.items = defaultItems();
    }
  }, [history, postStore]);

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
    const { action } = history;
    const scroll = sessionStorage.getItem('scroll');
    if (scroll && action === 'POP') {
      window.scrollTo(0, scroll);
      sessionStorage.removeItem('scroll');
    }
  }, [history]);

  React.useEffect(() => {
    history.push({ ...(postStore.selectedTab !== defaultTab ? { search: `?tab=${postStore.selectedTab}` } : {}) });
  }, [history, postStore.selectedTab]);

  const { handleToggle, toggle } = useToggle({
    createTopicModal: create ? JSON.parse(create.toLowerCase()) : false,
    tour: true,
  });

  React.useEffect(() => {
    postStore.getData();
  }, [postStore]);

  React.useEffect(() => {
    tagStore.tagListByCount({ limit: 1000 }).then((res) => {
      setTagList(res.data);
    });
  }, [tagStore]);

  const fetchData = debounce(
    React.useCallback(
      (options) => {
        postStore.filters = { ...postStore.filters, ...options };
        postStore.getData();
      },
      [postStore]
    ),
    100
  );

  const onChangeTab = (tab) => {
    if (!window.event.ctrlKey) {
      postStore.items = defaultItems();
      postStore.filters = { pageIndex: 1, pageSize: 10 };
      postStore.selectedTab = tab;
      postStore.getData();
    }
  };

  const disableBody = (target) => disableBodyScroll(target);
  const enableBody = (target) => enableBodyScroll(target);

  const handleCreateTopic = async () => {
    if (!isReady) return;

    if (userStore.user) {
      handleToggle({ createTopicModal: !toggle.createTopicModal });
      const res = await draftStore.find({ isPost: true });

      const draft = first(res.data.filter((i) => !i.post));
      if (draft?.isPost) {
        setDraft(draft);
      }
    } else {
      window.location.href = LOGIN_URL;
    }
  };

  React.useEffect(() => {
    const { next_page, current_page, total_page } = postStore.items;
    if (inView && next_page && current_page <= total_page) {
      // postStore.isLoading = true;

      fetchData({ pageIndex: next_page });
    }
  }, [fetchData, inView, postStore]);

  const handleCleanup = (redirectUrl) => {
    handleToggle({ createTopicModal: false });
    if (redirectUrl) {
      history.push(redirectUrl);
    }
  };

  const handleDiscardDraft = async (id, modal) => {
    handleToggle({ [modal]: false });
    await draftStore.delete(id);
    setDraft(null);
    handleToggle({ [modal]: true });
  };

  return (
    <>
      <main className="container mx-auto wrapper">
        {/* <TrendingSection /> */}
        <section className="various-topics">
          {
            <div className="items-center lg:flex">
              <TabsForHome
                tabs={userStore.user ? TABS : TABS.filter((i) => i.value !== 'unread')}
                current={postStore.selectedTab}
                onClick={onChangeTab}
                containerClassName="hidden lg:flex"
                className="text-gray-400"
                tagList={tagList}
              />
              <TabMobileMenu
                tabs={userStore.user ? TABS : TABS.filter((i) => i.value !== 'unread')}
                current={postStore.selectedTab}
                onClick={onChangeTab}
                tagList={tagList}
              >
                <div className="ml-auto text-xs xl:text-lg">
                  <button
                    className="ml-auto btn btn-primary"
                    onClick={handleCreateTopic}
                    data-cy="create_topic_modal"
                    data-tut="create_topic"
                  >
                    Create Topics
                  </button>
                  <Link
                    to={`${ROUTES.TOPIC}?type=activity`}
                    className="ml-2 text-center btn btn-primary"
                    data-cy="topics_view_all"
                    data-tut="view_all_topics"
                  >
                    View All
                  </Link>
                </div>
              </TabMobileMenu>
            </div>
          }
          <div className="mt-12">
            {postStore.items.data.map((item, index) => (
              <TopicItem key={item._id} data={item} list={postStore.items.data} index={index} />
            ))}
            {postStore.isLoading ? <Loading /> : <div ref={isReady && refView}></div>}
          </div>
        </section>
        {/* <CustomerCases /> */}
      </main>
      {toggle.createTopicModal && (
        <TopicModal
          onToggle={(show) => {
            handleToggle({ createTopicModal: show || !toggle.createTopicModal });
          }}
          data={draft}
          draft={draft}
          onCleanup={handleCleanup}
          onDiscardDraft={(id) => handleDiscardDraft(id, 'createTopicModal')}
        />
      )}
      <Tour
        onRequestClose={() => tour.setShow(false)}
        steps={tourConfig}
        isOpen={tour.show}
        rounded={5}
        accentColor="#ffb81c"
        onAfterOpen={disableBody}
        onBeforeClose={enableBody}
      />
    </>
  );
};

export default inject(({ postStore, tagStore, userStore, draftStore }) => ({
  postStore,
  tagStore,
  userStore,
  draftStore,
}))(observer(Topics));

const tourConfig = [
  {
    selector: '.avatar',
    content: `Hi, this is a tour in the Peplink Forum.`,
  },
  {
    selector: '[data-tut="trending_section"]',
    content: `This is the trending categories.`,
  },
  {
    selector: '[data-tut="sorting-topics"]',
    content: `This is the sorting functions.`,
  },
  {
    selector: '[data-tut="create_topic"]',
    content: `Please click here to create a new topic.`,
  },
  {
    selector: '[data-tut="view_all_topics"]',
    content: `Please click here to see all topics.`,
  },
  {
    content: `Click anywhere to continue.`,
  },
  // {
  //   selector: '[data-tut="reactour__scroll"]',
  //   content:
  //     'Probably you noted that the Tour scrolled directly to the desired place, and you could control the time also…',
  // },
  // {
  //   selector: '[data-tut="reactour__scroll--hidden"]',
  //   content: 'Also when places are pretty hidden…',
  // },
  // {
  //   selector: '[data-tut="reactour__action"]',
  //   content: 'When arrived on each place you could fire an action, like… (look at the console)',
  //   action: () =>
  //     console.log(`
  //                 ------------🏠🏚---------
  //     🚌 Arrived to explore these beautiful buildings! 🚌
  //                 ------------🏠🏚---------
  //  🚧 This action could also fire a method in your Component 🚧
  //   `),
  // },
  // {
  //   selector: '[data-tut="reactour__state"]',
  //   content: 'And the Tour could be observing changes to update the view, try clicking the button…',
  //   observe: '[data-tut="reactour__state--observe"]',
  // },
];
