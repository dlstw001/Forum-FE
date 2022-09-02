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
import ReplyActions from './ReplyActions';
import ReplyContent from 'components/common/ReplyContent';
import UserItem from 'components/common/UserItem';
import UserPopover from 'components/common/UserPopover';
import useToggle from 'hooks/useToggle';

const ReplyItem = (props) => {
  const {
    data: _data,
    postStore,
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
    caseStore,
    replyStore,
  } = props;
  const history = useHistory();
  const [data, setData] = React.useState(_data);
  const [mode, setMode] = React.useState(null);
  const buttonRef = React.useRef(null);
  const [user, setUser] = React.useState();
  const [skip, setSkip] = React.useState();
  const [isTop, setIsTop] = React.useState();
  const [show, setShow] = React.useState(!data.hidden);

  useScrollPosition(({ currPos }) => {
    setIsTop(currPos.y === 0);
  });

  const [refView, inView, entry] = useInView({
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

  React.useEffect(() => {
    if (shouldScroll) {
      startScroll(ref.current);
    }
  }, [entry, shouldScroll, startScroll]);

  React.useEffect(() => {
    if (isFirst ? isTop : true && inView && !skip) {
      setSkip(true);
      setIsTop(false);
      onLoad(isFirst ? 'prev' : 'next', data.replyNo);
    }
  }, [data.replyNo, inView, isFirst, isTop, onLoad, skip]);

  const handleDeleteReply = async () => {
    const { creator } = data;
    const { item } = await caseStore.deleteReply(data.post._id, data._id);
    setData({ ...item, creator, raw: '(deleted)' });
  };

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
    caseStore.replyNo = null;
    history.push({
      pathname: getTopicUrl(post),
      ...(window.location.search && { search: window.location.search }),
    });
  };

  const debounceRef = React.useRef(
    debounce((value) => {
      const replyNo = value.closest('.reply-item').attributes.replyno?.value;
      caseStore.replyNo = replyNo;
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
    return ((whisper || deleted) && !userStore.isAdmin) || (!raw && !content);
  }, [data, userStore.isAdmin]);

  if (currentRef.current && !isHidden) {
    observer.observe(currentRef.current);
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
              <div ref={refView}></div>
              <div>
                <UserItem
                  user={data.creator}
                  size="md"
                  className="mr-4 media-avatar max-w-none"
                  onClick={handleAvatarClick}
                />
              </div>

              <div className="relative flex-grow media-description">
                <div className="reply-floor">#{data.replyNo}</div>
                <span className="cursor-pointer creator-name" onClick={handleAvatarClick}>
                  {data.creator?.displayName}
                  {data?.whisper && <i className="ml-2 material-icons">visibility_off</i>}
                </span>
                <p className="text-sm leading-tight capitalize">
                  <span className="block">{data.creator?.role}</span>
                  <span className="block">{data.creator?.moderator && 'Peplink Team'}</span>
                  {distanceDateFormat(data.createdAt)}
                </p>

                <ReplyContent
                  value={data.raw || data.content}
                  className="pb-4 mb-4"
                  setQuote={setQuote}
                  data={data}
                  refProp={refProp}
                />
                <ReplyActions
                  store={replyStore}
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
            <p className="view-hidden" onClick={() => setShow(true)}>
              View hidden reply
            </p>
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

export default inject(({ userStore, postStore, messageStore, caseStore, replyStore }) => ({
  userStore,
  postStore,
  messageStore,
  caseStore,
  replyStore,
}))(observer(ReplyItem));
