import { inject, observer } from 'mobx-react';
import cx from 'classnames';
import React from 'react';
import Tooltip from './Tooltip';
import UserListModal from 'components/common/modals/UserListModal';
import useToggle from 'hooks/useToggle';

const ActivitySummary = ({ children, className, count, handleLikeClick, data, postStore }) => {
  const { handleToggle, toggle } = useToggle({ contributorsList: false, favouriteList: false });
  const [lifetimeHover, setLifetimeHover] = React.useState(false);
  const [likeHover, setLikeHover] = React.useState(false);

  const [items, setItems] = React.useState({ data: [] });
  const [likeItems, setLikeItems] = React.useState({ data: [] });

  const getData = React.useCallback(async () => {
    lifetimeHover &&
      (await postStore.contributorsList(data._id, { limit: 1000 }).then((data) => {
        setItems(data);
      }));

    likeHover &&
      (await postStore.likeList(data._id, { limit: 1000 }).then((data) => {
        setLikeItems(data);
      }));
  }, [data, postStore, lifetimeHover, likeHover]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  return (
    <span className={cx('activity-summary flex items-center', className)}>
      <Tooltip
        placement="bottom"
        trigger={count.contributors > 0 ? 'hover' : null}
        tooltip={
          <div
            className="tooltip-contributors"
            onClick={() => handleToggle({ contributorsList: !toggle.contributorsList })}
          >
            <ul>
              {items.data.slice(0, 6).map((item, index) => (
                <li key={index} className="mb-1">
                  {item.user.name}
                </li>
              ))}
              {items.total > 6 && (
                <li key={6} className="mb-1">
                  {'and ' + (items.total - 6) + ' more ...'}
                </li>
              )}
            </ul>
          </div>
        }
      >
        <button
          className="btn-statistics"
          onClick={() => handleToggle({ contributorsList: !toggle.contributorsList })}
          onMouseEnter={() => count.contributors > 0 && setLifetimeHover(true)}
          onMouseLeave={() => setLifetimeHover(false)}
          data-cy={`topic_btn_contributor_list_${data.title}`}
          title="Contributors"
        >
          <i className="mr-1 material-icons md-20">account_circle</i>
          <span className="counter">{count.contributors || 0}</span>
        </button>
      </Tooltip>
      <button className="btn-statistics" title="Views">
        <i className="mr-1 material-icons md-20">visibility</i>
        <span className="counter">{count.views || 0}</span>
      </button>
      <Tooltip
        placement="bottom"
        trigger={count.noLikes ? 'hover' : null}
        // modifiers={[
        //   {
        //     name: 'offset',
        //     options: {
        //       offset: [0, 10],
        //     },
        //   },
        // ]}
        tooltip={
          <div className="tooltip-contributors" onClick={() => handleToggle({ favouriteList: !toggle.favouriteList })}>
            <ul>
              {likeItems.data.slice(0, 6).map((item, index) => (
                <li key={index} className="mb-1">
                  {item.user.displayName}
                </li>
              ))}
              {likeItems.data.length > 6 && (
                <li key={6} className="mb-1">
                  {'and ' + (likeItems.data.length - 6) + ' more ...'}
                </li>
              )}
            </ul>
          </div>
        }
      >
        <button
          className="btn-like"
          onMouseEnter={() => count.noLikes > 0 && setLikeHover(true)}
          onMouseLeave={() => setLikeHover(false)}
          data-key={'like_topic'}
          title="Likes"
        >
          <i
            className={cx('mr-1 material-icons md-20 md-heart', { 'btn-liked': count.liked })}
            data-cy={`topic_btn_like_${data.title}`}
            onClick={handleLikeClick}
          >
            favorite
          </i>
          <span
            className="counter md-22"
            onClick={() => handleToggle({ favouriteList: !toggle.favouriteList })}
            data-cy={`topic_btn_like_list_${data.title}`}
          >
            {count.noLikes || 0}
          </span>
        </button>
      </Tooltip>

      <button className="btn-comment" title="Replies">
        <i className="mr-1 material-icons md-comment md-20">insert_comment</i>
        <span className="counter">{count.replies || 0}</span>
      </button>
      {children}
      {toggle.contributorsList && (
        <UserListModal
          id={data._id}
          onToggle={() => handleToggle({ contributorsList: !toggle.contributorsList })}
          title="List of Contributors"
        />
      )}
      {toggle.favouriteList && (
        <UserListModal
          id={data._id}
          mode={'like'}
          onToggle={() => handleToggle({ favouriteList: !toggle.favouriteList })}
          title="List of Favourites"
        />
      )}
    </span>
  );
};

export default inject(({ postStore }) => ({ postStore }))(observer(ActivitySummary));
