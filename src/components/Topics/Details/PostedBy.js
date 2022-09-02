import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import ActivitySummary from 'components/common/ActivitySummary';
import cx from 'classnames';
import Dropdown from 'components/common/Dropdown';
//import { differenceInCalendarDays } from 'date-fns';
import { distanceDateFormat, getTopicUrl, timeAgoFormat } from 'utils';
import React from 'react';
import SendInviteModal from './SendInviteModal';
import ShareBar from 'components/common/ShareBar';
// import UserItem from 'components/common/UserItem';
import { isToday } from 'date-fns';
import { NOTIFICATIONLVL } from 'definitions';
import { useHotkeys } from 'react-hotkeys-hook';
import UserItem from 'components/common/UserItem';
import useToggle from 'hooks/useToggle';

const PostedBy = ({
  data,
  postStore,
  userStore,
  // hideSpy,
  isMsg,
}) => {
  const [watching, setWatching] = React.useState({ label: NOTIFICATIONLVL[2].name, icon: NOTIFICATIONLVL[2].icon });
  const [bookmark, setBookmark] = React.useState();
  const [bookmarkItems, setBookmarkItems] = React.useState({ data: [] });
  const [liked, setLike] = React.useState();
  const [noLikes, setNoLikes] = React.useState(data.noLikes);

  const { handleToggle, toggle } = useToggle({
    inviteModal: false,
    stats: false,
  });

  const getData = React.useCallback(
    (invalidate) => {
      data &&
        data._id &&
        postStore.bookmarkList(data._id, {}, invalidate).then((data) => {
          setBookmarkItems(data);
        });
    },
    [postStore, data]
  );

  const shareBtn = React.useRef(null);

  useHotkeys('shift+s', () => {
    shareBtn && shareBtn?.current && shareBtn.current.click();
  });

  React.useEffect(() => {
    getData();
  }, [getData]);

  React.useEffect(() => {
    setBookmark(data.bookmarked);
  }, [data]);

  React.useEffect(() => {
    setLike(data.liked);
  }, [data]);

  React.useEffect(() => {
    if (data.notificationLevel !== undefined) {
      setWatching({
        label: NOTIFICATIONLVL[data.notificationLevel].name,
        icon: NOTIFICATIONLVL[data.notificationLevel].icon,
      });
    }
  }, [data]);

  const handleBookmark = async () => {
    bookmark
      ? (await postStore.removeBookmark(data._id)) && setBookmark(false)
      : (await postStore.bookmark(data._id)) && setBookmark(true);
    getData(true);
  };

  const handleLikeClick = async () => {
    if (liked) {
      const resRemoveLike = await postStore.removeLike(data._id);
      setNoLikes(resRemoveLike.item.likes.length);
      setLike(false);
    } else {
      const resLike = await postStore.like(data._id);
      setNoLikes(resLike.item.likes.length);
      setLike(true);
    }
  };

  const notificationSettings = async (val) => {
    await postStore.updateNotificationLevel(data._id, { level: val }).then(() => {
      setWatching({
        label: NOTIFICATIONLVL[val].name,
        icon: NOTIFICATIONLVL[val].icon,
      });
    });
  };

  return (
    <>
      {data.creator && bookmarkItems.data && (
        <div className="p-3 mb-6 bg-gray-100 lg:bg-transparent">
          <div>
            <div className="flex items-center lg:block">
              <Link to={`${ROUTES.PROFILE}/${data?.creator?.displayName?.toLowerCase()}`}>
                <UserItem user={data.creator} size="md" className="mr-4">
                  <div className="post-by">
                    <div className="font-semibold text-primary">Posted By</div>
                    <div>{data.creator.displayName}</div>
                  </div>
                </UserItem>
              </Link>
              <button
                onClick={() => handleToggle({ stats: !toggle.stats })}
                className="ml-auto btn btn-icon lg:hidden "
              >
                <span className="material-icons bg-gray-50">
                  {toggle.stats ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                </span>
              </button>
            </div>

            <div className="mt-3 ml-auto text-sm">
              <div className="flex md:block">
                {isToday(new Date(data.createdAt)) ? 'Created ' : 'Created on '}
                <span className="ml-auto">{distanceDateFormat(data.createdAt)}</span>
              </div>
              {data?.deleted && (
                <div className="flex md:block">
                  {isToday(new Date(data.deletedAt)) ? 'Deleted ' : 'Deleted at '}
                  <span className="ml-auto">{distanceDateFormat(data.deletedAt)}</span>
                </div>
              )}
              <div className="flex md:block">
                Last Activity:{' '}
                <span className="ml-auto">
                  {data.lastModified ? timeAgoFormat(data.lastModified) : timeAgoFormat(data.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <div className={cx('lg:block mt-4', { hidden: !toggle.stats })}>
            <div className="mb-8">
              {!data.deleted && userStore.user && (
                <Dropdown
                  menuClassname="text-black action-menu"
                  className="block"
                  menu={({ style }) => (
                    <div className="watching-list-menu">
                      <ul style={{ style }}>
                        {NOTIFICATIONLVL.slice(0, 4).map((i) => (
                          <li key={i.value}>
                            <button onClick={() => notificationSettings(i.value)}>
                              <div className="watching-items">
                                <i className="mr-1 material-icons">{i.icon}</i>
                                {i.label}
                              </div>
                              <div className="text-xs">{i.description}</div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                >
                  <button className="btn btn-watching">
                    <i className="mr-2 text-3xl material-icons">{watching.icon}</i>
                    {watching.label}
                  </button>
                </Dropdown>
              )}
              <ActivitySummary
                data={data}
                count={{
                  contributors: data.noContributors,
                  views: data.views,
                  noLikes: noLikes,
                  replies: data.noReplies,
                  liked: liked,
                }}
                className="flex flex-wrap items-center mb-2"
                handleLikeClick={() => handleLikeClick()}
              >
                {!data.deleted && !isMsg && (
                  <>
                    <Dropdown
                      placement="bottom-end"
                      menuClassname="bg-share w-auto"
                      menu={() => (
                        <>
                          <ShareBar
                            url={`${window.location.host}${getTopicUrl(data)}`}
                            title={data.title}
                            description={data.content}
                            hashtag={data.tags}
                          />
                        </>
                      )}
                    >
                      <button className="btn-share" data-key={'share_topic'} data-cy="topic_btn_share" ref={shareBtn}>
                        <i className="material-icons flipped_img">reply</i> Share
                      </button>
                    </Dropdown>
                    {!data.deleted && userStore.user && (
                      <button
                        className="btn-follow reply-follow-btn"
                        onClick={handleBookmark}
                        data-key={'bookmark_topic'}
                        data-cy="topic_btn_follow"
                      >
                        <i className={cx('material-icons lg-18 mr-1', bookmark && 'text-primary')}>bookmark</i>
                        {bookmark ? 'Bookmarked' : 'Bookmark'}
                      </button>
                    )}
                  </>
                )}
              </ActivitySummary>
            </div>

            {!!data.tags.length && (
              <>
                <h3 className="sidebar-title">Tags</h3>
                <div className="flex flex-wrap gap-2 ">
                  {data.tags.map((item) => (
                    <Link key={item._id} className="tags" to={`${ROUTES.TOPIC}?tab=findByTag&tag=${item.name}`}>
                      {item.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
            {/*<h3 className="sidebar-title">Followers</h3>
            <div className="flex">
              {bookmarkItems.data.length !== 0
                ? bookmarkItems.data.map((item) => <UserItem key={item.user._id} user={item.user} />)
                : 'No followers yet'}
              </div>*/}
          </div>
        </div>
      )}
      {toggle.inviteModal && <SendInviteModal onToggle={() => handleToggle({ inviteModal: !toggle.inviteModal })} />}
    </>
  );
};

export default inject(({ postStore, userStore }) => ({ postStore, userStore }))(observer(PostedBy));
