import { distanceDateFormat, getTopicUrl } from 'utils';
import { inject, observer } from 'mobx-react';
// import { isToday } from 'date-fns';
import { debounce } from 'lodash';
import { useHistory } from 'react-router';
import { useInView } from 'react-intersection-observer';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';

import CreateMessageModal from 'components/common/modals/CreateMessageModal';
import cx from 'classnames';
import React from 'react';
import ReplyActions from 'components/common/ReplyActions';
import ReplyContent from 'components/common/ReplyContent';
import UserItem from 'components/common/UserItem';
import UserPopover from 'components/common/UserPopover';
import useToggle from 'hooks/useToggle';

const ReplyItem = (props) => {
  const {
    data: _data,
    postStore,
    store,
    userStore,
    setQuote,
    refProp,
    post,
    shouldScroll,
    isLast = false,
    isFirst = false,
    onLoad,
    handleForm,
    startScroll,
    scrolled,
    isCase,
    isReady,
    setToReplyNo,
  } = props;
  const history = useHistory();
  const [data, setData] = React.useState(_data);
  const [mode, setMode] = React.useState(null);
  const buttonRef = React.useRef(null);
  const [user, setUser] = React.useState();
  const [skip, setSkip] = React.useState();
  const [isTop, setIsTop] = React.useState();
  const [show, setShow] = React.useState(!data.hidden);
  const [replyOpen, setReplyOpen] = React.useState(false);

  useScrollPosition(({ currPos }) => {
    setIsTop(currPos.y === 0);
  });

  const [refView, inView] = useInView({
    threshold: 1,
    initialInView: false,
  });
  const { toggle, handleToggle } = useToggle({
    showReplies: false,
    flagModal: false,
    moveModal: false,
    createMessage: false,
    changeCreatorModal: false,
  });
  const ref = React.useRef();
  const currentRef = React.useRef();

  React.useEffect(() => {
    setSkip(!isLast && !isFirst);
  }, [isFirst, isLast]);

  async function fetchData() {
    await onLoad(isFirst ? 'prev' : 'next', data.replyNo);
    startScroll(ref.current);
  }
  const fetchDataRef = React.useRef(
    debounce(() => {
      fetchData();
    }, 500)
  );

  React.useEffect(() => {
    if (shouldScroll && isReady) {
      fetchDataRef.current();
    }
  }, [isReady, shouldScroll]);

  React.useEffect(() => {
    if (isFirst ? isTop : true && inView && !skip) {
      setSkip(true);
      setIsTop(false);
      onLoad(isFirst ? 'prev' : 'next', data.replyNo);
    }
  }, [data.replyNo, inView, isFirst, isTop, onLoad, skip]);

  const handleDeleteReply = async () => {
    const { creator } = data;
    const { item } = await store.delete(data.post._id, data._id);
    setData({ ...item, creator, raw: '(deleted)' });
  };

  React.useEffect(() => {
    const { _id, post, read } = data;
    if (inView) {
      !isCase && inView && !read && localStorage.getItem(process.env.REACT_APP_APP_NAME) && store.read(post._id, _id);
    }
  }, [data, inView, isCase, store]);

  const isAcceptedAnswer = React.useMemo(() => {
    return post.accepted_answers?.some((i) => i.reply._id === data._id);
  }, [data._id, post.accepted_answers]);

  const handleAvatarClick = React.useCallback(
    (e) => {
      setUser(data.creator?.displayName);
      buttonRef.current = e.target;
      handleToggle({ userPopover: true });
    },
    [data.creator, handleToggle]
  );

  const handleEdit = (data) => {
    setMode(mode !== 'edit' ? 'edit' : null);
    handleForm({ data, mode: 'edit' });
  };

  const handleSolutionReply = async () => {
    const payload = {
      reply: data._id,
    };

    isAcceptedAnswer
      ? await postStore.unsolve(data.post._id || data.post, payload)
      : await postStore.solve(data.post._id || data.post, payload);
    store.replyNo = null;
    history.push({
      pathname: getTopicUrl(post),
      ...(window.location.search && { search: window.location.search }),
    });
  };

  const debounceRef = React.useRef(
    debounce((value) => {
      const replyNo = value.closest('.reply-item').attributes.replyno?.value;
      store.replyNo = replyNo;
    }, 500)
  );

  let options = {
    rootMargin: '-80px 0px -85% 0px',
    threshold: 0.1,
  };

  let observer = new IntersectionObserver((entries) => {
    const { isIntersecting, target } = entries[0];
    if (scrolled && isIntersecting) {
      debounceRef.current(target);
    }
  }, options);

  const isHidden = React.useMemo(() => {
    const { whisper, deleted, raw, content } = data;
    return ((whisper || deleted) && !userStore.IS_ADMIN_OR_MODERATOR) || (!raw && !content);
  }, [data, userStore.IS_ADMIN_OR_MODERATOR]);

  if (currentRef.current && !isHidden) {
    observer.observe(currentRef.current);
  }

  function openReply() {
    setReplyOpen(true);
  }

  function closeReply() {
    setReplyOpen(false);
  }

  return (
    <>
      <section
        ref={currentRef}
        id={data._id}
        replyno={data.replyNo}
        className={cx('reply-item', { show: show }, { 'reply-hidden': isHidden }, { 'reply-deleted': data?.deleted })}
      >
        <div className={cx('flex items-start pb-4 mb-4 media-container')} ref={ref}>
          {show ? (
            <>
              <div ref={refView}>
                <UserItem
                  user={data.creator}
                  size="md"
                  className="mr-4 media-avatar max-w-none"
                  onClick={handleAvatarClick}
                />
              </div>
              <div className="relative flex-grow media-description">
                <div className="reply-floor">#{data.replyNo}</div>
                <span className="creator-name">
                  <span onClick={handleAvatarClick} className="cursor-pointer">
                    {data.creator?.displayName}
                  </span>
                  {data?.whisper && <i className="ml-2 material-icons">visibility_off</i>}
                </span>
                <p className="text-sm leading-tight capitalize">
                  <span className="block">{data.creator?.role}</span>
                  <span className="block">{data.creator?.moderator && 'Peplink Team'}</span>
                  {distanceDateFormat(data.createdAt)}
                </p>
                <ReplyContent value={data.raw || data.content} setQuote={setQuote} data={data} refProp={refProp} />
                {data.replyToReply?._id && (
                  <>
                    <div className="reply-box">
                      <span
                        className="reply-floor-btn"
                        onClick={() => {
                          setToReplyNo(data.replyToReply.replyNo);
                        }}
                      >
                        #{data.replyToReply.replyNo}
                      </span>

                      <div className="reply-divide"></div>

                      <div className="w-full">
                        <div className="flex justify-between mb-4">
                          <div className="flex">
                            <UserItem
                              user={data.replyToReply.creator}
                              size="md"
                              className="mr-4 media-avatar max-w-none"
                            />
                            <span className="reply-name">{data.replyToReply.creator?.displayName}</span>
                          </div>
                          {data.replyToReply?._id && !replyOpen && (
                            <div
                              onClick={() => openReply()}
                              className="my-4 text-sm font-semibold text-gray-400 cursor-pointer"
                            >
                              Show Content<i className="ml-1 text-lg material-icons">expand_more</i>
                            </div>
                          )}
                          {replyOpen && (
                            <div
                              onClick={() => closeReply()}
                              className="my-4 text-sm font-semibold text-gray-400 cursor-pointer"
                            >
                              Hide Content<i className="ml-1 text-lg material-icons">expand_less</i>
                            </div>
                          )}
                        </div>

                        {replyOpen && (
                          <ReplyContent
                            value={data.replyToReply.raw || data.replyToReply.content}
                            data={data.replyToReply}
                            setQuote={setQuote}
                            refProp={refProp}
                            className="reply-content"
                          />
                        )}
                      </div>
                    </div>
                  </>
                )}

                <ReplyActions
                  store={store}
                  handleForm={handleForm}
                  onDelete={handleDeleteReply}
                  onEdit={handleEdit}
                  onSolution={handleSolutionReply}
                  data={data}
                  post={post}
                  solution={isAcceptedAnswer}
                />
              </div>
            </>
          ) : (
            <div className="view-hidden" onClick={() => setShow(true)}>
              View hidden reply
            </div>
          )}
        </div>
      </section>

      {toggle.userPopover && (
        <UserPopover
          onToggleMessage={() => handleToggle({ createMessage: true })}
          user={user}
          onClose={() => handleToggle({ userPopover: false })}
          buttonRef={buttonRef}
        />
      )}

      {toggle.createMessage && (
        <CreateMessageModal
          onToggle={(show) => handleToggle({ createMessage: show || !toggle.createMessage })}
          toUser={user}
        />
      )}
    </>
  );
};

export default inject(({ userStore, postStore, messageStore, caseStore }) => ({
  userStore,
  postStore,
  messageStore,
  caseStore,
}))(observer(ReplyItem));
