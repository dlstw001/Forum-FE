import { FLAGSTATUS, ROUTES } from 'definitions';
import { format } from 'date-fns';
import { inject, observer } from 'mobx-react';
import Breadcrumb from 'components/common/Breadcrumb';
import cx from 'classnames';
import Filters from './Filters';
import GroupByTopic from './GroupByTopic';
import Loading from 'components/common/Loading';
import MobileDropdownButton from 'components/common/MobileDropdownButton';
import qs from 'query-string';
import React from 'react';
import Tabs from 'components/common/Tabs';
import TopicItemToReview from './TopicItemToReview';
import useToggle from 'hooks/useToggle';

const TABS = [
  { value: 'all', label: 'View All', 'data-cy': 'view_all' },
  { value: 'gbt', label: 'Grouped by Topic', 'data-cy': 'grouped_by_topic' },
];

const formatDate = (date) => format(date, 'yyyy-MM-dd');

const Review = ({ reviewStore, history }) => {
  const { post_id } = qs.parse(history.location.search);
  const { tab } = qs.parse(history.location.search);
  const [selectedTab, setSelectedTab] = React.useState(tab || 'all');
  const [items, setItems] = React.useState({ data: [] });
  const [isBottom, setIsBottom] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [advanceFilters, setAdvanceFilters] = React.useState({ status: FLAGSTATUS[0].value });
  const { handleToggle, toggle } = useToggle({
    mobileMenu: false,
    filter: false,
  });

  const [filters, setFilters] = React.useState({
    pageSize: 10,
    pageIndex: 1,
  });

  const getData = React.useCallback(async () => {
    setIsLoading(true);
    const payload = {
      post: post_id,
      ...advanceFilters,
      page: filters.pageIndex,
      limit: filters.pageSize,
      order_by: 'desc',
      sort_by: 'createdAt',
    };
    await reviewStore.find(payload).then((res) => {
      setItems((prevState) => {
        const { data, ...rest } = prevState;

        return {
          ...rest,
          ...res,
          data: [...data, ...res.data],
        };
      });
      setIsLoading(false);
    });
  }, [reviewStore, filters.pageIndex, filters.pageSize, advanceFilters, post_id]);

  const handleSuccess = (res) => {
    setItems({
      ...items,
      data: [...items.data.filter((i) => i._id !== res.item._id)],
    });
  };

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

  const handleFilterChange = (form) => {
    const { status, type, review_type, priority, category, reviewer, user, date_from, date_to, orderBy } = form;

    const statusPayload = status ? { status: status.value } : {};
    const typePayload = type ? { type: type.value } : {};
    const review_typePayload = review_type ? { review_type: review_type.value } : {};
    const priorityPayload = priority ? { score_from: priority.score_from, score_to: priority.score_to } : {};
    const categoryPayload = category ? { category: category._id } : {};
    const reviewerPayload = reviewer ? { reviewer: reviewer._id } : {};
    const userPayload = user ? { user: user._id } : {};
    const dateFromToPayload =
      date_from && date_to
        ? { date_from: formatDate(date_from), date_to: formatDate(date_to) }
        : { date_from: null, date_to: null };
    const orderBySortPayload = orderBy
      ? { sort_by: orderBy.sort_by, order_by: orderBy.order_by }
      : { sort_by: null, order_by: null };

    const payload = {
      ...statusPayload,
      ...typePayload,
      ...review_typePayload,
      ...priorityPayload,
      ...categoryPayload,
      ...reviewerPayload,
      ...userPayload,
      ...dateFromToPayload,
      ...orderBySortPayload,
    };

    setFilters({ pageIndex: 1, pageSize: 10 });
    setItems({ data: [] });
    setAdvanceFilters(payload);
  };

  const onChangeTab = (tab) => {
    setSelectedTab(tab);
    if (tab === 'all') {
      history.push(ROUTES.REVIEW);
      window.location.reload();
    }
  };

  const onRemoveGrouping = () => {
    history.push(ROUTES.REVIEW);
    setFilters({ pageIndex: 1, pageSize: 10 });
    setItems({ data: [] });
    getData();
  };

  return (
    <main className="container wrapper">
      <div className="w-full">
        <Breadcrumb title={`Review`} className="mb-8" />

        <MobileDropdownButton
          title={'Filter'}
          onToggle={() => handleToggle({ filter: !toggle.filter })}
          isOpen={toggle.filter}
        />

        {toggle.filter && (
          <div className="mb-4 lg:hidden">
            <div className="p-4 bg-gray-50 ">
              <div className="flex mb-4">
                <button onClick={() => handleToggle({ filter: false })} className="ml-auto material-icons">
                  close
                </button>
              </div>
              <Filters onChange={handleFilterChange} />
            </div>
          </div>
        )}

        <MobileDropdownButton
          title={selectedTab}
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
      </div>
      {selectedTab === 'all' && (
        <div className="lg:flex">
          <div className="hidden lg:block sidebar lg:mr-8">
            {post_id && (
              <div className="mb-2" onClick={onRemoveGrouping}>
                <p>You have filtered to reviewable content in a single topic.</p>
                <button className="w-full px-4 py-2 bg-gray-200">
                  <i className="mr-2 material-icons md-16 closed">close</i>Show all topics
                </button>
              </div>
            )}
            <div className="md:block xs:hidden">
              <Filters onChange={handleFilterChange} />
            </div>
          </div>
          <div className="flex-grow">
            {items.data.map((item, key) => (
              <TopicItemToReview key={item._id + key} data={item} onSuccess={handleSuccess} />
            ))}
            {items?.data?.length < 1 && !isLoading && <p>There are no items to review</p>}
            {isLoading && <Loading />}
          </div>
        </div>
      )}
      {selectedTab === 'gbt' && (
        <GroupByTopic setSelectedTab={setSelectedTab} setGlobalItems={setItems} setAdvanceFilters={setAdvanceFilters} />
      )}
    </main>
  );
};

export default inject(({ reviewStore }) => ({ reviewStore }))(observer(Review));
