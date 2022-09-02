import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import React from 'react';
import UserItem from 'components/common/UserItem';

export default ({ user = {} }) => {
  const UserUnfo = ({ item }) => (
    <Link to={`${ROUTES.PROFILE}/${item.user?.displayName?.toLowerCase()}`}>
      <UserItem user={item.user} size="lg" className="mr-4" containerClassName="most-liked-users">
        <div className="mr-4 text-sm">
          <div className="mr-2 font-semibold">{item.user.displayName}</div>
          <div>
            <i className="mr-2 material-icons md-18 btn-liked">favorite</i>
            {item.count}
          </div>
        </div>
      </UserItem>
    </Link>
  );

  return (
    <div className="mb-4 grid grid-cols-2 gap-6">
      <div id="most-liked-by">
        <h4 className="summary-subtitle">Most Liked By</h4>
        {user.mostLikedBy?.length ? (
          <div className="mb-4 grid gap-4 xl:grid-cols-2 lg:grid-cols-1">
            {user.mostLikedBy.slice(0, 2).map((i) => (
              <UserUnfo item={i} key={i.user._id} />
            ))}
          </div>
        ) : (
          'No liked yet'
        )}
      </div>
      <div id="most-liked">
        <h4 className="summary-subtitle">Most Liked</h4>
        {user.mostLiked?.length ? (
          <div className="mb-4 grid gap-4 xl:grid-cols-2 lg:grid-cols-1">
            {user.mostLiked.slice(0, 2).map((i) => (
              <UserUnfo item={i} key={i.user._id} />
            ))}
          </div>
        ) : (
          'No likes yet'
        )}
      </div>
    </div>
  );
};
