import { debounce } from 'lodash';
import { distanceDateFormat, getMessageUrl } from 'utils';
import { inject, observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
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
    replyStore,
    store,
    userStore,
    setQuote,
    refProp,
    post,
    shouldScroll,
    isLast = false,
    isFirst = false,
    onLoad,
    startScroll,
    scrolled,
    showHiddenReplyAction,
    getData,
  } = props;

  const history = useHistory();
  const [data, setData] = React.useState(_data);
  const buttonRef = React.useRef(null);
  const [user, setUser] = React.useState();
  const [skip, setSkip] = React.useState();
  const [isTop, setIsTop] = React.useState();

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
    restoreModal: false,
    createMessage: false,
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
    const { item } = await replyStore.delete(data.post._id, data._id);
    await getData();
    setData({ ...item, creator, raw: '(deleted)' });
  };

  const handleRestoreReply = async () => {
    const { item } = await replyStore.update(data.post._id, data._id, { deleted: false });
    await getData();
    history.push(getMessageUrl(post, item.replyNo));
  };

  React.useEffect(() => {
    const { _id, post, read } = data;
    if (inView) {
      inView && !read && localStorage.getItem(process.env.REACT_APP_APP_NAME) && replyStore.read(post._id, _id);
    }
  }, [data, inView, replyStore]);

  const handleAvatarClick = React.useCallback(
    (e) => {
      setUser(data.creator?.displayName);
      buttonRef.current = e.target;
      handleToggle({ userPopover: true });
    },
    [data.creator, handleToggle]
  );

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

  if (currentRef.current) {
    observer.observe(currentRef.current);
  }

  return (
    <>
      <section
        ref={currentRef}
        id={data._id}
        replyno={data.replyNo}
        className={cx(
          'reply-item',
          { 'reply-hidden': (data?.whisper || data?.deleted) && !userStore.isAdmin },
          { 'reply-deleted': data?.deleted }
        )}
      >
        <div className={cx('flex items-start pb-4 mb-4 media-container')} ref={ref}>
          {!data?.hidden ? (
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
                <div className="flex cursor-pointer creator-name" onClick={handleAvatarClick}>
                  {data.creator?.displayName}
                  {data?.whisper && <i className="ml-2 material-icons">visibility_off</i>}
                </div>
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
                  store={store}
                  onDelete={handleDeleteReply}
                  onRestore={handleRestoreReply}
                  data={data}
                  post={post}
                  isMessage
                  urlGenerator={getMessageUrl}
                />
              </div>
            </>
          ) : (
            <p className="view-hidden" onClick={() => showHiddenReplyAction(data._id)}>
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

export default inject(({ userStore, replyStore, postStore, messageStore, caseStore }) => ({
  userStore,
  replyStore,
  postStore,
  messageStore,
  caseStore,
}))(observer(ReplyItem));
