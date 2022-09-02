import { debounce } from 'lodash';
import { first, isEmpty, uniqBy } from 'lodash';
import { getCaseUrl, getTopicUrl, scrollTo } from 'utils';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import { parse } from 'query-string';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import cx from 'classnames';
import Input from 'components/common/Form/Input';
import Loading from 'components/common/Loading';
import React from 'react';
import ReminderModal from 'components/common/modals/ReminderModal';
import ReplyForm from 'components/common/ReplyForm';
import ReplyItem from './ReplyItem';

const ORDER_BY = {
  ASC: 'asc',
  DESC: 'desc',
};
const DIRECTION = {
  PREV: 'prev',
  NEXT: 'next',
};

const SORTING = {
  LATEST: 'latest',
  OLDEST: 'oldest',
  LIKES: 'likes',
};

const sortingList = [
  { label: 'Sort By Oldest', value: SORTING.OLDEST },
  { label: 'Sort By Latest', value: SORTING.LATEST },
];

const defaultReplies = () => ({ data: [] });
const pageSize = 10;

const Replies = ({
  history,
  location,
  store,
  messageStore,
  draftStore,
  caseStore,
  userStore,
  editorStore,
  refProp,
  id,
  post,
  draft,
  setDraft,
  isMessage,
  isCase,
  setQuote,
  canReply,
  match,
  onSort,
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
  const [direction, setDirection] = React.useState(DIRECTION.NEXT);
  const [isReady, setIsReady] = React.useState();
  const [toReplyNo, setToReplyNo] = React.useState('');
  const [filters, setFilters] = React.useState({
    pageSize,
    sortBy: 'createdAt',
    orderBy: sort,
    replyNo,
  });
  const ref = React.useRef();
  const bookmarkRef = React.useRef();

  React.useEffect(() => {
    store.replies = defaultReplies();
  }, [store]);

  React.useEffect(() => {
    onSort && onSort(filters.orderBy);
  }, [filters.orderBy, onSort]);

  const debounceRef = React.useRef(
    debounce(() => {
      setIsReady(true);
    }, 1000)
  );

  const getData = React.useCallback(async () => {
    if (!id) return false;
    debounceRef.current();

    setIsLoading(true);
    const payload = {
      page: filters.pageIndex,
      limit: filters.pageSize,
      sort_by: filters.sortBy,
      order_by: filters.orderBy,
      replyNo: filters.replyNo,
    };

    const method = isMessage ? messageStore.getReply : isCase ? caseStore.getReply : store.get;
    const res = await method(id, payload);
    const { data, ...rest } = store.replies;
    let replies;

    if (filters.orderBy === ORDER_BY.DESC) {
      replies = first(res.data)?.replyNo > first(data)?.replyNo ? [...res.data, ...data] : [...data, ...res.data];
    } else {
      replies = first(res.data)?.replyNo > first(data)?.replyNo ? [...data, ...res.data] : [...res.data, ...data];
    }

    store.replies = {
      ...rest,
      ...res,
      data: uniqBy(replies, '_id'),
    };

    setIsLoading(false);
  }, [
    caseStore.getReply,
    filters.orderBy,
    filters.pageIndex,
    filters.pageSize,
    filters.replyNo,
    filters.sortBy,
    id,
    isCase,
    isMessage,
    messageStore.getReply,
    store,
  ]);

  React.useEffect(() => {
    setReplies(store.replies);
  }, [store.replies]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  const fetchData = React.useCallback(async (options) => {
    await setFilters((prevState) => ({ ...prevState, ...options }));
  }, []);

  const getUrl = React.useCallback(
    (post, replyNo = null) => (!isCase ? getTopicUrl(post, replyNo) : getCaseUrl(post, replyNo)),
    [isCase]
  );

  const handleLoadData = React.useCallback(
    async (direction, reply_no) => {
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
            bookmarkRef.current = document.querySelector(`[replyNo="${reply_no}"]`);
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
    (el, force = false) => {
      if (!scrolled || force) {
        setTimeout(() => {
          if (el) {
            scrollTo(el);
            setScrolled(true);
          }
        }, 1000);
        if (filters.orderBy === ORDER_BY.ASC) {
          checkPagination();
        }
      }
    },
    [checkPagination, filters.orderBy, scrolled]
  );

  const resetRef = React.useRef(
    debounce(() => {
      bookmarkRef.current = null;
      setIsProcessing(false);
    }, 100)
  );

  // scroll back to previous
  var mutationObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function () {
      if (bookmarkRef.current && isProcessing) {
        bookmarkRef.current.scrollIntoView();
        window.scrollBy(0, -200);
        resetRef.current();
      }
    });
  });

  if (ref.current) {
    mutationObserver.observe(ref.current, {
      subtree: true,
      childList: true,
    });
  }

  const handleSorting = async (sortBy) => {
    store.replyNo = null;

    const orderBy = sortBy === 'latest' ? ORDER_BY.DESC : ORDER_BY.ASC;
    if (userStore?.user) {
      await userStore.updateMe({ ...userStore.user, postSort: orderBy });
      await userStore.me(true);
    }

    history.replace({
      pathname: getUrl(post, null),
      ...(sortBy === SORTING.LATEST && { search: `?sort=desc` }),
    });
  };

  const onSave = async (formData) => {
    const { data, mode, original, ...rest } = replyObject || {};
    const payload = {
      ...(mode !== 'reply' && { data }),
      ...formData,
      published: true,
      ...rest,
    };

    const method = isMessage ? messageStore.createReply : isCase ? caseStore.createReply : store.create;
    let item;
    if (mode === 'edit') {
      const res = await store.update(original.post._id, original._id, payload);
      item = res.item;
    } else {
      const res = await method(id, payload);
      item = res.item;
    }
    return item;
  };

  const handleCleanUp = (item) => {
    handleToggle({ replyPopupForm: false });
    history.replace(getUrl(post, item.replyNo));

    if (post?.category?.req_approval_reply && !userStore.IS_ADMIN_OR_MODERATOR) {
      handleToggle({ hiddenInfoModal: !toggle.hiddenInfoModal });
    }
  };

  // const getReplyDraft = React.useCallback(async () => {
  //   const res = await draftStore.find({ post: post._id });
  //   const draft = first(res.data.filter((i) => !i.isPost));
  //   return !draft?.isPost && draft;
  // }, [draftStore, post._id]);

  const handlePostReply = async () => {
    if (toggle.replyPopupForm) {
      handleToggle({ replyPopupForm: false });
    } else {
      handleForm({
        data: post,
        mode: 'reply',
        link: (
          <Link className="text-primary" to={{ pathname: getTopicUrl(post) }}>
            {post.title}
          </Link>
        ),
        replyTo: post._id,
        replyToPost: true,
      });
    }
  };

  const methods = useForm({
    defaultValues: {
      replyNo: 0,
    },
  });

  const { handleSubmit } = methods;

  const jumpModalOnClose = () => handleToggle({ goToModal: !toggle.goToModal });
  const goToReply = ({ replyNo }) => {
    history.replace({
      pathname: getUrl(post, replyNo),
    });
  };

  React.useEffect(() => {
    const action = history.action;

    if (userStore?.user && !isEmpty(post) && action !== 'PUSH') {
      if (userStore.user.postSort === SORTING.LATEST && sort !== ORDER_BY.DESC) {
        history.replace({
          pathname: getUrl(post, replyNo),
          search: `?sort=desc`,
        });
      } else if (userStore.user.postSort === SORTING.OLDEST && sort !== ORDER_BY.ASC) {
        history.replace({
          pathname: getUrl(post, replyNo),
        });
      }
    }
  }, [getUrl, history, post, replyNo, sort, userStore.user]);

  const handleDiscardDraft = async (id, replyObject) => {
    handleToggle({ replyPopupForm: false });
    await draftStore.delete(id);
    setReplyObject({ ...replyObject, data: replyObject.original, content: null, draft: null });
    setDraft(null);
    handleToggle({ replyPopupForm: true });
  };

  useHotkeys('shift+r', handlePostReply);
  useHotkeys('shift+3', () => handleToggle({ goToModal: true }));

  // Redirect to replyToReply
  React.useEffect(() => {
    const reply = document.querySelector(`[replyno="${toReplyNo}"]`)?.querySelector('div');
    if (toReplyNo !== '') {
      if (reply) {
        handleScroll(document.querySelector(`[replyno="${toReplyNo}"]`).querySelector('div'), true);
      } else {
        history.replace({
          pathname: getUrl(post, toReplyNo),
          search: sort,
        });
      }
      setToReplyNo('');
    }
  }, [toReplyNo, post, getUrl, history, sort, handleScroll]);

  return (
    <div className="replies">
      {post?.noReplies !== 0 && (
        <div className="flex items-center mb-8">
          <div className="count-responses">
            {post?.noReplies !== 1 ? `${post.noReplies || 0} responses` : `1 response`}
          </div>
          {!isLoading && (
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
          )}
        </div>
      )}
      {!post.deleted && !(post.archived || post.closed) && userStore.user && canReply && (
        <div className="flex">
          <button className="ml-auto btn-reply-floor" onClick={handlePostReply}>
            Reply
          </button>
        </div>
      )}
      {userStore.user && (
        <div className={cx('reply-popup-form w-full response-form', { visible: toggle.replyPopupForm })}>
          <div className={cx('container relative  mx-auto', { 'max-w-4xl': !editorStore.isPreview })}>
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
      <div ref={ref} className="xxx">
        {replies.data.map((item, key) => (
          <ReplyItem
            isFirst={key === 0}
            isLast={replies.data.length - 1 === key}
            key={item._id}
            shouldScroll={item.replyNo === parseInt(replyNo)}
            startScroll={handleScroll}
            scrolled={scrolled}
            data={item}
            handleForm={handleForm}
            isCase={isCase}
            post={post}
            setQuote={setQuote}
            onLoad={handleLoadData}
            store={store}
            isReady={isReady}
            setToReplyNo={setToReplyNo}
          />
        ))}
      </div>

      {isLoading && <Loading />}

      {toggle.hiddenInfoModal && (
        <ReminderModal
          onToggle={() => handleToggle({ hiddenInfoModal: !toggle.hiddenInfoModal })}
          message="Your reply is under review by our moderators. Please wait."
          isOnlyOk
        />
      )}
      {toggle.goToModal && replies?.total > 0 && (
        <Modal size="xs" containerClass="bg-secondary p-6" onToggle={jumpModalOnClose}>
          <ModalHeader onToggle={jumpModalOnClose}>Jump to...</ModalHeader>
          <form onSubmit={handleSubmit(goToReply)}>
            <div className="flex items-center mb-4">
              #
              <Input
                type="number"
                name="replyNo"
                min={1}
                step={1}
                max={replies?.total}
                containerClassName="mb-0 mx-2"
                methods={methods}
                rules={{
                  required: true,
                  min: 1,
                  max: replies?.total,
                }}
              />
              <span>of {replies?.total} post(s)</span>
            </div>

            <ModalFooter>
              <button className="ml-3 btn btn-outline" onClick={jumpModalOnClose} data-cy="cancel_btn">
                Cancel
              </button>
              <button
                className="ml-3 btn btn-outline"
                type="submit"
                data-cy="confirm_btn"
                disabled={replies?.total === 0}
              >
                Ok
              </button>
            </ModalFooter>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default inject(({ messageStore, editorStore, draftStore, caseStore, userStore }) => ({
  messageStore,
  editorStore,
  draftStore,
  caseStore,
  userStore,
}))(withRouter(observer(Replies)));
