import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import React from 'react';
import UserItem from 'components/common/UserItem';

export default ({ results, handleCTR }) => {
  const User = ({ data, onClick }) => (
    <Link
      className="flex items-center mb-2"
      to={`${ROUTES.PROFILE}/${data.displayName}`}
      key={data._id}
      onClick={() => onClick(data)}
    >
      <UserItem user={data} size="xs" className="mr-2" />
      <div className="search-users">{data.name}</div>
    </Link>
  );

  return (
    <>
      {!!results.users.data.length && (
        <>
          <p>Users</p>
          <div className="break-all">
            {results.users.data.map((i) => (
              <User data={i} key={i._id} onClick={() => handleCTR(results.log.item._id)} />
            ))}
          </div>
        </>
      )}
    </>
  );
};
