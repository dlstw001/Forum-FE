import { DIRECTION, ORDER_BY, SORTING } from 'definitions';
import { first, isEmpty, uniqBy } from 'lodash';
import { getCaseUrl } from 'utils';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { parse } from 'query-string';
import cx from 'classnames';
import HtmlParser from 'react-html-parser';
import Loading from 'components/common/Loading';
import React from 'react';
import ReplyForm, { ARCHETYPE } from 'components/common/ReplyForm';
import ReplyItem from './ReplyItem';

const sortingList = [
  { label: 'Sort By Oldest', value: SORTING.OLDEST },
  { label: 'Sort By Latest', value: SORTING.LATEST },
];

const defaultReplies = () => ({ data: [] });
const pageSize = 10;

const Replies = ({
  history,
  location,
  draftStore,
  caseStore,
  replyStore,
  userStore,
  refProp,
  id,
  post,
  draft,
  setDraft,
  isMessage,
  setQuote,
  canReply,
  match,
  onSort,
  getData: _getData,
  toggle,
  handleToggle,
  replyObject,
  setReplyObject,
  handleForm,
}) => {
  const { sort = userStore.user?.postSort === 'desc' ? ORDER_BY.DESC : ORDER_BY.ASC } = parse(location.search);
  const { replyNo } = match.params;
  const [replies, setReplies] = React.useState({ data: [] });
  const [isLoading, setIsLoading] = React.useState(true);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(replyNo ? false : true);
  const [bookmark, setBookmark] = React.useState();
  const [direction, setDirection] = React.useState(DIRECTION.NEXT);
  const [filters, setFilters] = React.useState({
    pageSize,
    sortBy: 'createdAt',
    orderBy: sort,
    replyNo,
  });

  React.useEffect(() => {
    caseStore.replies = defaultReplies();
  }, [caseStore, match.params]);

  React.useEffect(() => {
    onSort && onSort(filters.orderBy);
  }, [filters.orderBy, onSort]);

  const getData = React.useCallback(async () => {
    if (!id) return false;

    setIsLoading(true);
    const payload = {
      page: filters.pageIndex,
      limit: filters.pageSize,
      sort_by: filters.sortBy,
      order_by: filters.orderBy,
      replyNo: filters.replyNo,
    };

    const res = await caseStore.getReply(id, payload);
    const { data, ...rest } = caseStore.replies;
    let replies;

    // if (filters.orderBy === ORDER_BY.DESC) {

    if (filters.orderBy === ORDER_BY.DESC) {
      replies = first(res.data)?.replyNo > first(data)?.replyNo ? [...res.data, ...data] : [...data, ...res.data];
    } else {
      replies = first(res.data)?.replyNo > first(data)?.replyNo ? [...data, ...res.data] : [...res.data, ...data];
    }

    caseStore.replies = {
      ...rest,
      ...res,
      data: uniqBy(replies, '_id'),
    };

    setIsLoading(false);
  }, [caseStore, filters.orderBy, filters.pageIndex, filters.pageSize, filters.replyNo, filters.sortBy, id]);

  React.useEffect(() => {
    setReplies(caseStore.replies);
  }, [caseStore.replies]);

  const fetchData = React.useCallback((options) => {
    setFilters((prevState) => ({ ...prevState, ...options }));
  }, []);

  const handleLoadData = React.useCallback(
    (direction, reply_no) => {
      const { prev_page, next_page } = replies;
      if (!isProcessing) {
        setDirection(direction);
        if (direction === DIRECTION.NEXT) {
          const replyNo = filters.orderBy === ORDER_BY.DESC ? reply_no - 1 : reply_no + 1;
          if (next_page) {
            fetchData({ replyNo });
          }
        } else {
          if (prev_page) {
            const replyNo = filters.orderBy === ORDER_BY.DESC ? reply_no + 1 : reply_no - 1;
            setBookmark(document.querySelector(`[replyNo="${reply_no}"]`));
            setIsProcessing(true);
            fetchData({ replyNo });
          }
        }
      }
    },
    [fetchData, filters.orderBy, isProcessing, replies]
  );

  const checkPagination = React.useCallback(() => {
    const { replyNo } = first(replies.data);
    if (replies.data.length !== filters.pageSize) {
      handleLoadData(DIRECTION.PREV, replyNo);
    }
  }, [filters.pageSize, handleLoadData, replies.data]);

  const handleScroll = React.useCallback(
    (el) => {
      if (!scrolled) {
        setTimeout(() => {
          el.classList.add('glow');
          el.scrollIntoView();
          window.scrollBy(0, -80);
          setScrolled(true);
        });
        if (filters.orderBy === ORDER_BY.ASC) {
          checkPagination();
        }
      }
    },
    [checkPagination, filters.orderBy, scrolled]
  );

  // scroll back to previous
  React.useEffect(() => {
    if (bookmark && isProcessing) {
      setTimeout(() => {
        bookmark.scrollIntoView();
      }, 1000);
      setBookmark(null);
      setIsProcessing(false);
    }
  }, [bookmark, isProcessing]);

  const handleSorting = async (sortBy) => {
    caseStore.replyNo = null;
    const orderBy = sortBy === 'latest' ? ORDER_BY.DESC : ORDER_BY.ASC;
    fetchData({ orderBy });

    if (userStore?.user) {
      await userStore.updateMe({ ...userStore.user, postSort: orderBy });
      await userStore.me(true);
    }

    history.push({
      pathname: getCaseUrl(post),
      ...(orderBy === SORTING.LATEST && { search: `?sort=desc` }),
    });
  };

  const onSave = async (formData) => {
    const { data, mode, original } = replyObject || {};
    const payload = {
      ...(mode !== 'reply' && { data }),
      ...formData,
      published: true,
      ...(data && { replyTo: data._id }),
    };

    let item;
    if (mode === 'edit') {
      const res = await caseStore.update(original.post._id, original._id, payload);
      item = res.item;
    } else {
      const res = await caseStore.createReply(id, payload);
      item = res.item;
    }
    return item;
  };

  const handlePostReply = async () => {
    if (toggle.replyPopupForm) {
      handleToggle({ replyPopupForm: false });
    } else {
      handleForm({
        data: post,
        mode: 'reply',
        link: (
          <Link className="text-primary" to={{ pathname: getCaseUrl(post) }}>
            {HtmlParser(post.title)}
          </Link>
        ),
      });
    }
  };

  const showHiddenReply = (id) => {
    setReplies((prevState) => {
      const { data, ...rest } = prevState;
      const indexOfReply = data.map((i) => i._id).indexOf(id);

      data[indexOfReply].hidden = false;

      return { data, ...rest };
    });
  };

  const handleDiscardDraft = async (id, replyObject) => {
    handleToggle({ replyPopupForm: false });
    await draftStore.delete(id);
    setReplyObject({ ...replyObject, data: replyObject.original, content: null, draft: null });
    setDraft(null);
    handleToggle({ replyPopupForm: true });
  };

  const handleCleanUp = (item) => {
    handleToggle({ replyPopupForm: false });
    history.replace(getCaseUrl(post, item.replyNo));
  };

  React.useEffect(() => {
    if (id) {
      getData();
    }
  }, [getData, id]);

  React.useEffect(() => {
    getData();
  }, [getData, match.params]);

  React.useEffect(() => {
    const action = history.action;

    if (userStore?.user && !isEmpty(post) && action !== 'PUSH') {
      if (userStore.user.postSort === SORTING.LATEST && sort !== ORDER_BY.DESC) {
        history.replace({
          pathname: getCaseUrl(post, replyNo),
          search: `?sort=desc`,
        });
      } else if (userStore.user.postSort === SORTING.OLDEST && sort !== ORDER_BY.ASC) {
        history.replace({
          pathname: getCaseUrl(post, replyNo),
        });
      }
    }
  }, [history, post, replyNo, sort, userStore.user]);

  return (
    <div className="replies">
      <div className="flex items-center mb-8">
        <div className="count-responses">
          {replyStore.index.length !== 1 ? `${replyStore.index.length || 0} responses` : `1 response`}
        </div>
        <select
          defaultValue={sort === 'desc' && 'latest'}
          className="flex ml-auto sorting-replies"
          onChange={(e) => handleSorting(e.target.value)}
        >
          {sortingList.map((i, index) => (
            <option key={index} value={i.value}>
              {i.label}
            </option>
          ))}
        </select>
      </div>
      {!post.deleted && !(post.archived || post.closed) && userStore.user && canReply && (
        <div className="flex">
          <button className="ml-auto btn-reply-floor" onClick={handlePostReply} ref={refProp}>
            Reply
          </button>
        </div>
      )}
      {userStore.user && (
        <div className={cx('reply-popup-form w-full response-form', { visible: toggle.replyPopupForm })}>
          <div className="container relative max-w-4xl mx-auto">
            <button
              className="btn-toggle btn-toggle-full material-icons"
              onClick={() => handleToggle({ editorFull: !toggle.editorFull })}
            >
              {toggle.editorFull ? 'close_fullscreen' : 'open_in_full'}
            </button>
            <button className="btn-toggle material-icons" onClick={handlePostReply} ref={refProp}>
              keyboard_double_arrow_up
            </button>
            <div style={{ minHeight: '20vh' }}>
              {toggle.replyPopupForm && (
                <ReplyForm
                  onSubmit={onSave}
                  onToggle={(show = false) => {
                    handleToggle({ replyPopupForm: show });
                  }}
                  onReply={handlePostReply}
                  placeholder="Let's discuss together"
                  postId={id}
                  replyObject={replyObject}
                  isExpanded={toggle.editorFull}
                  archetype={ARCHETYPE.CASE}
                  draft={draft}
                  onCleanup={handleCleanUp}
                  onDiscardDraft={handleDiscardDraft}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {isLoading && direction === DIRECTION.PREV && <Loading />}

      {replies.data.map((item, key) => (
        <ReplyItem
          isFirst={key === 0}
          isLast={replies.data.length - 1 === key}
          key={item._id}
          shouldScroll={item.replyNo === parseInt(replyNo)}
          startScroll={handleScroll}
          scrolled={scrolled}
          data={item}
          onForm={handleForm}
          isMessage={isMessage}
          isCase={true}
          post={post}
          setQuote={setQuote}
          onLoad={handleLoadData}
          showHiddenReplyAction={showHiddenReply}
          store={caseStore}
          getData={_getData}
        />
      ))}

      {isLoading && <Loading />}
    </div>
  );
};

export default inject(({ caseStore, userStore, replyStore, draftStore }) => ({
  caseStore,
  userStore,
  replyStore,
  draftStore,
}))(withRouter(observer(Replies)));
