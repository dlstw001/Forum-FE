import { getTopicUrl, timeAgoFormat } from 'utils';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import ActivitySummary from './ActivitySummary';
import AvatarMedia from './AvatarMedia';
import cx from 'classnames';
import Dropdown from './Dropdown';
import React from 'react';
import ReminderModal from 'components/common/modals/ReminderModal';
import ShareBar from './ShareBar';
import useClickOutside from 'hooks/useClickOutside';
import useToggle from 'hooks/useToggle';

const HottestTagItem = ({ data }) => {
  return (
    <Link className="tags" to={`${ROUTES.TOPIC}?tab=findByTag&tag=${data.name}`} data-cy={`topic_tag_${data.name}`}>
      {data.name}
    </Link>
  );
};

const TopicItem = ({ postStore, userStore, data, index, list, toShow = true, children }) => {
  const ref = React.useRef();
  const { toggle, handleToggle } = useToggle({ share: false, likeDeleted: false, bookmarkDeleted: false });
  const [bookmark, setBookmark] = React.useState();
  const [liked, setLike] = React.useState();
  const [show, setShow] = React.useState(!data.hidden);
  const [noLikes, setNoLikes] = React.useState(data.noLikes);

  useClickOutside({ onClose: () => handleToggle({ share: false }), elemRef: ref });

  React.useEffect(() => {
    setBookmark(data.bookmarked);
  }, [data]);

  React.useEffect(() => {
    setLike(data.liked);
  }, [data]);

  const handleBookmark = async () => {
    if (data.deleted) {
      handleToggle({ bookmarkDeleted: !toggle.bookmarkDeleted });
    } else {
      if (bookmark) {
        await postStore.removeBookmark(data._id);
        setBookmark(false);
      } else {
        await postStore.bookmark(data._id);
        setBookmark(true);
      }
    }
  };

  const handleLikeClick = async () => {
    if (data.deleted) {
      handleToggle({ likeDeleted: !toggle.likeDeleted });
    } else {
      if (liked) {
        // get removeLike response and look for the length of likes inside it
        const resRemoveLike = await postStore.removeLike(data._id);
        setNoLikes(resRemoveLike.item.likes.length);
        setLike(false);
      } else {
        const resLike = await postStore.like(data._id);
        setNoLikes(resLike.item.likes.length);
        setLike(true);
      }
    }
  };

  return (
    <>
      <div
        className={cx(
          !(
            new Date(userStore?.user?.lastSeen) < new Date(list[index]?.lastModified) &&
            new Date(userStore?.user?.lastSeen) > new Date(list[index + 1]?.lastModified)
          )
            ? 'topic-row'
            : 'py-4'
        )}
        ref={ref}
      >
        {show ? (
          <>
            <div className="mb-4 md:flex">
              <AvatarMedia className="flex mb-2 md:mb-0" user={data.creator} data={data} showPopup={true} />
              <div className="mb-4 ml-auto last-activity md:text-right md:pl-2">
                Last Activity: {data.lastModified ? timeAgoFormat(data.lastModified) : timeAgoFormat(data.createdAt)}
              </div>
            </div>
            {!toShow && <p className="mt-2 mb-8 leading-tight break-all excerpt">{data.summary}</p>}
            {children}
            <div className="items-end lg:flex">
              {!!data.tags.length && (
                <div className="flex mb-4 gap-2 lg:mb-auto">
                  {data.tags.map((item) => (
                    <HottestTagItem key={item._id} data={item} />
                  ))}
                </div>
              )}
              {toShow && (
                <div className="flex items-center ml-auto activity-summary">
                  <ActivitySummary
                    data={data}
                    count={{
                      contributors: data.noContributors,
                      views: data.noViews ? data.noViews : data.views,
                      noLikes: noLikes,
                      replies: data.noReplies,
                      liked: liked,
                    }}
                    handleLikeClick={() => handleLikeClick()}
                  >
                    <>
                      <Dropdown
                        placement="bottom-end"
                        menuClassname="bg-share w-auto"
                        menu={() => (
                          <ShareBar
                            url={`${window.location.host}${getTopicUrl(data)}`}
                            title={data.title}
                            description={data.content}
                            hashtag={data.tags}
                          />
                        )}
                      >
                        <button
                          className="-ml-1 btn-share"
                          onClick={() => handleToggle({ share: !toggle.share })}
                          data-cy={`topic_btn_share_${data.title}`}
                        >
                          <i className="mr-1 material-icons md-22 md-reply">reply</i>
                          Share
                        </button>
                      </Dropdown>

                      {userStore.user && (
                        <button
                          className="-ml-1 btn-follow"
                          onClick={handleBookmark}
                          data-cy={`topic_btn_follow_${data.title}`}
                        >
                          <i className={cx('material-icons md-18 mr-1', bookmark && 'text-primary')}>bookmark</i>
                          {bookmark ? 'Bookmarked' : 'Bookmark'}
                        </button>
                      )}
                    </>
                  </ActivitySummary>
                </div>
              )}
            </div>
            {new Date(userStore?.user?.lastSeen) < new Date(list[index]?.lastModified) &&
              new Date(userStore?.user?.lastSeen) > new Date(list[index + 1]?.lastModified) && (
                <div className="separator">Last Visit</div>
              )}
          </>
        ) : (
          <p className="view-hidden" onClick={() => setShow(true)}>
            View hidden post
          </p>
        )}
      </div>

      {toggle.likeDeleted && (
        <ReminderModal
          onToggle={() => handleToggle({ likeDeleted: !toggle.likeDeleted })}
          message={'You cannot like this topic as it was deleted. Please recover it first.'}
          isOnlyOk
        />
      )}
      {toggle.bookmarkDeleted && (
        <ReminderModal
          onToggle={() => handleToggle({ bookmarkDeleted: !toggle.bookmarkDeleted })}
          message={'You cannot bookmark this topic as it was deleted. Please recover it first.'}
          isOnlyOk
        />
      )}
    </>
  );
};

export default inject(({ postStore, userStore }) => ({ postStore, userStore }))(observer(TopicItem));
