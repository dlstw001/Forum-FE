import { showCreateCasesButton as allowReplies } from 'utils';
import { inject, observer } from 'mobx-react';
import { isEmpty, uniqBy } from 'lodash';
import { withRouter } from 'react-router-dom';
import Form from './Form';
import React from 'react';
import ResponseItem from './ResponseItem';
import UserItem from 'components/common/UserItem';

const sortingList = [
  { label: 'Sort By Latest', value: 'desc' },
  { label: 'Sort By Oldest', value: 'asc' },
];

const Replies = ({ customerCaseStore, userStore, refProp, post }) => {
  const [replies, setReplies] = React.useState({ data: [] });
  const [isBottom, setIsBottom] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = React.useState(false);
  const [filters, setFilters] = React.useState({
    pageSize: 5,
    pageIndex: 1,
    order: 'desc',
    orderby: 'date',
  });

  const getData = React.useCallback(async () => {
    const payload = {
      page: filters.pageIndex,
      per_page: filters.pageSize,
      order: filters.order,
      orderby: 'date',
    };

    setIsLoading(true);
    if (post?.wp_id) {
      customerCaseStore.getReplies(post.wp_id, payload).then((res) => {
        setReplies((prevState) => {
          const { data, ...rest } = prevState;
          return {
            ...rest,
            ...res,
            data: uniqBy([...data, ...res.data], 'id'),
          };
        });

        setIsLoading(false);
      });
    }
  }, [filters.pageIndex, filters.pageSize, filters.order, post.wp_id, customerCaseStore]);

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

  const onSave = async (data) => {
    setIsSubmitLoading(true);
    let { comment } = await customerCaseStore.addReplies(post?.wp_id, data);
    setReplies((prevState) => ({ ...prevState, total: prevState.total + 1, data: [comment, ...prevState.data] }));
    setIsSubmitLoading(false);
  };

  const handleSorting = (order) => {
    setIsLoading(true);
    setReplies({ data: [] });
    setFilters((prevState) => ({ ...prevState, pageIndex: 1, order }));
  };

  React.useEffect(() => {
    window.addEventListener('scroll', isScrolling);
    return () => window.removeEventListener('scroll', isScrolling);
  }, []);

  React.useEffect(() => {
    if (isBottom && replies.total_page >= filters.pageIndex && !isLoading) {
      setIsBottom(false);
      fetchData({ pageIndex: filters.pageIndex + 1 });
    }
  }, [fetchData, filters.pageIndex, isBottom, replies.total_page, isLoading]);

  return (
    <>
      {(!isEmpty(userStore?.user) || replies?.total > 0) && (
        <div className="flex items-center justify-between mb-8">
          <div className="font-bold uppercase text-primary">
            {replies?.total === 1 ? '1 response' : `${replies?.total || 0} responses`}
          </div>
          <select className="flex ml-auto sorting-replies" onChange={(e) => handleSorting(e.target.value)}>
            {sortingList.map((i, index) => (
              <option key={index} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {allowReplies(userStore?.user) && (
        <div className="flex items-start mb-4">
          <UserItem user={userStore?.user} size="md" />
          <Form
            onSubmit={onSave}
            placeholder="Let's discuss together"
            refProp={refProp}
            postId={post?.wp_id}
            isLoading={isSubmitLoading}
          />
        </div>
      )}

      {replies.data.map((item) => (
        <ResponseItem key={item.id} data={item} onSuccess={getData} />
      ))}
    </>
  );
};

export default inject(({ customerCaseStore, userStore }) => ({ customerCaseStore, userStore }))(
  withRouter(observer(Replies))
);
