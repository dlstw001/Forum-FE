import { addQueryParams, removeQueryParams } from 'utils';
import { chunk, first, isEmpty } from 'lodash-es';
import { dateFormat, getTopicUrl } from 'utils';
import { inject, observer } from 'mobx-react';
import { isDate } from 'date-fns';
import { Link } from 'react-router-dom';
import { Modal } from 'components/common/Modal';
import { ROUTES } from 'definitions';
import { sub } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import { withRouter } from 'react-router-dom';
import AdvanceSearch from './components/AdvanceSearch';
import Breadcrumb from 'components/common/Breadcrumb';
import ct from 'countries-and-timezones';
import Loading from 'components/common/Loading';
import qs from 'query-string';
import React from 'react';
import TopicItem from 'components/common/TopicItem';
import UserItem from 'components/common/UserItem';
import useToggle from 'hooks/useToggle';

const Search = ({ searchStore, history, location }) => {
  const { term } = qs.parse(history.location.search);
  const [allItems, setAllItems] = React.useState(defaultState());
  const [items, setItems] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const { handleToggle, toggle } = useToggle({ mobileMenu: false, search: false, filterModal: false });
  const methods = useForm({ defaultValues: defaultValues() });
  const { reset, watch, getValues } = methods;
  const allValues = watch();

  const [isReady, setIsReady] = React.useState();

  const [refView, inView] = useInView({
    threshold: 1,
    initialInView: false,
    rootMargin: '200px 0px',
  });

  const { categories, tags, from, to, orderBy, creator, datePosted } = getValues();

  const getData = React.useCallback(async () => {
    if ((datePosted?.key === 'fromTo' && !(isDate(from) && isDate(to))) || !isReady) return false;

    setIsLoading(true);

    const payload = {
      ...(term ? { term: term } : {}),
      ...(categories ? { category: categories.map((cat) => cat._id) } : {}),
      ...(tags ? { tags: tags.map((tag) => tag._id) } : {}),
      ...{
        ...getDateRange(datePosted && datePosted.key),
        ...(from && to && { from: dateFormat(from, 'yyyy-MM-dd'), to: dateFormat(to, 'yyyy-MM-dd') }),
      },
      ...(orderBy ? { sort: orderBy.sort } : { sort: 'score' }),
      ...(creator ? { creator: creator._id } : {}),
    };

    setItems([]);
    setAllItems([]);
    setIsLoading(true);

    await searchStore
      .getAdvanced(payload)
      .then((res) => {
        const chunkedItems = chunk(res?.data, 2) || [];
        setAllItems(chunkedItems);
        setItems(first(chunkedItems));
        setCurrentPage(0);
        setIsLoading(false);
      })
      .finally(() => setIsLoading(false));
  }, [categories, creator, datePosted, from, isReady, orderBy, searchStore, tags, term, to]);

  const onChangeInput = React.useCallback(
    (term) => {
      setItems([]);
      setAllItems([]);
      term ? addQueryParams('term', term, history) : removeQueryParams('term', history);
    },
    [history]
  );

  const handleReset = () => {
    removeQueryParams('term', history);
    reset(defaultValues());
    setItems([]);
    setAllItems([]);
  };

  const onToggleFilterModal = () => handleToggle({ filterModal: !toggle.filterModal });

  React.useEffect(() => {
    getData();
  }, [getData]);

  React.useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 1000);
  }, []);

  React.useEffect(() => {
    if (term && isEmpty(history.location.search)) {
      if (location.pathname === ROUTES.SEARCH) {
        onChangeInput(term);
      } else {
        reset({ ...allValues, term: term });
      }
    }
  }, [allValues, history.location.search, location.pathname, onChangeInput, reset, term]);

  React.useEffect(() => {
    if (inView && allItems.length > currentPage) {
      setItems((prevState) => [...(prevState || []), ...(allItems[currentPage + 1] || [])]);
      setCurrentPage(currentPage + 1);
    }
  }, [allItems, currentPage, inView]);

  return (
    <>
      <div className="container mx-auto mt-8 lg:flex lg:mt-16">
        <div className="hidden px-4 sidebar advance-search lg:block">
          <div className=" sidebar-sticky-margin">
            <AdvanceSearch methods={methods} onChangeInput={onChangeInput} term={term}>
              <button className="w-full btn btn-outline" type="button" onClick={handleReset} data-cy="reset_btn">
                Reset
              </button>
            </AdvanceSearch>
          </div>
        </div>
        <div className="w-full px-4">
          <Breadcrumb title="Search Page" className="mb-8" />
          <div className="flex items-center justify-end mb-8 lg:hidden">
            <button onClick={() => handleToggle({ filterModal: true })} className="btn btn-outline">
              <i className="icon-view-all material-icons md-24 md:mr-1">search</i>
              Show Filters
            </button>
          </div>

          {!isEmpty(items) &&
            items?.map((item, index) => (
              <TopicItem key={index} data={item} list={items || []} index={index} toShow={false}>
                {item?.replies &&
                  item.replies?.map((reply) => (
                    <Link
                      className="flex p-4 mb-4 ml-4 lg:ml-12 bg-secondary"
                      key={reply?._id}
                      to={getTopicUrl(reply, reply?.replyNo)}
                    >
                      <i className="text-black material-icons">reply</i>

                      <div>
                        <UserItem user={reply.creator} size="md" className="ml-2 mr-2 lg:ml-4 lg:mr-4" />
                      </div>
                      <div className="word-break">{reply?.summary}</div>
                    </Link>
                  ))}
              </TopicItem>
            ))}

          {isEmpty(items) && !isLoading && <h1>No results found.</h1>}
          <div ref={isReady && refView}>{isLoading && <Loading />}</div>
        </div>
      </div>
      {toggle.filterModal && (
        <Modal size="sm" containerClass="bg-secondary" onToggle={onToggleFilterModal}>
          <AdvanceSearch methods={methods} onChangeInput={onChangeInput} term={term}>
            <div className="grid grid-cols-2 gap-4">
              <button className="btn btn-outline" type="button" onClick={handleReset}>
                Reset
              </button>
              <button className="btn btn-outline" type="button" onClick={onToggleFilterModal}>
                View Results
              </button>
            </div>
          </AdvanceSearch>
        </Modal>
      )}
    </>
  );
};

export default inject(({ searchStore }) => ({ searchStore }))(withRouter(observer(Search)));

const getDateRange = (key) => {
  const currentDateTime = new Date();
  const currentTimeZone = Object.values(ct.getAllTimezones()).find(
    (i) => i.utcOffset === -new Date().getTimezoneOffset()
  ).aliasOf;

  switch (key) {
    case 'past_24hrs':
      return {
        from: dateFormat(sub(currentDateTime, { hours: 24 }), 'yyyy-MM-dd'),
        to: dateFormat(currentDateTime, 'yyyy-MM-dd'),
        tz: currentTimeZone,
      };
    case 'past_week':
      return {
        from: dateFormat(sub(currentDateTime, { weeks: 1 }), 'yyyy-MM-dd'),
        to: dateFormat(currentDateTime, 'yyyy-MM-dd'),
        tz: currentTimeZone,
      };
    case 'past_month':
      return {
        from: dateFormat(sub(currentDateTime, { months: 1 }), 'yyyy-MM-dd'),
        to: dateFormat(currentDateTime, 'yyyy-MM-dd'),
        tz: currentTimeZone,
      };
    case 'fromTo':
    case 'anytime':
    default:
      return { from: null, to: null, tz: currentTimeZone };
  }
};

const defaultState = () => ({ data: [] });
const defaultValues = () => ({
  categories: null,
  tags: null,
  datePosted: { key: 'anytime', label: 'Any Time' },
  from: null,
  to: null,
  tz: null,
  orderBy: {
    name: 'Relevance',
    sort: 'score',
  },
  creator: null,
});
