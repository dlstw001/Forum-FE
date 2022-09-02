import { dateFormat, getTopicUrl } from 'utils';
import { first } from 'lodash-es';
import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import React from 'react';
import UserItem from 'components/common/UserItem';

export default ({ user }) => {
  const topReply = React.useMemo(() => first(user?.topReply), [user]);
  const topPost = React.useMemo(() => first(user?.topPost), [user]);
  const topLink = React.useMemo(() => first(user?.topLink), [user]);
  const mostRepliedTo = React.useMemo(() => first(user?.mostRepliedTo), [user]);

  const UserInfo = ({ item }) => (
    <Link to={`${ROUTES.PROFILE}/${item.user?.displayName?.toLowerCase()}`}>
      <UserItem user={item.user} size="lg" className="mr-4" containerClassName="most-liked-users">
        <div className="mr-4 text-sm">
          <div className="mr-2 font-semibold">{item?.user?.displayName}</div>
          <div>
            <i className="mr-2 material-icons md-18">reply</i>
            {item.count}
          </div>
        </div>
      </UserItem>
    </Link>
  );

  const TopBlock = ({ item }) => (
    <div className="top-summary-block">
      <Link to={item.link}>
        <div className="date">{item.date}</div>
        <div className="topics-title">{item?.title}</div>
      </Link>
    </div>
  );

  return (
    <>
      <div className="mt-8">
        <div className="mb-4 grid grid-cols-2 gap-6">
          <div id="top-replies">
            <h4 className="summary-subtitle">Top Replies</h4>
            {topReply ? (
              <TopBlock
                item={{
                  link: getTopicUrl(topReply?.post),
                  date: dateFormat(topReply?.post?.createdAt),
                  title: topReply?.post?.title,
                }}
              />
            ) : (
              'No replies yet'
            )}
          </div>
          <div id="top-topics">
            <h4 className="summary-subtitle">Top Topics</h4>
            {topPost ? (
              <TopBlock
                item={{
                  link: getTopicUrl(topPost),
                  date: dateFormat(topPost?.createdAt),
                  title: topPost?.title,
                }}
              />
            ) : (
              'No topics yet'
            )}
          </div>
        </div>
        <div className="mb-4 grid grid-cols-2 gap-6">
          <div id="top-links">
            <h4 className="summary-subtitle">Top Links</h4>
            {topLink ? (
              <TopBlock
                item={{
                  link: `${ROUTES.TOPIC}/${topLink?.post?.slug}`,
                  date: dateFormat(topLink?.post?.createdAt),
                  title: topLink?.post?.title,
                }}
              />
            ) : (
              'No links yet'
            )}
          </div>
          <div id="most-replied">
            <h4 className="summary-subtitle">Most Replied To</h4>
            {mostRepliedTo ? (
              <div className="mb-4 grid gap-4 xl:grid-cols-2 lg:grid-cols-1">
                <UserInfo item={mostRepliedTo} />
              </div>
            ) : (
              'No replies yet'
            )}
          </div>
        </div>
      </div>
    </>
  );
};
