import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import { timeAgoFormat } from 'utils';
import LinkTopicTitle from 'components/common/LinkTopicTitle';
import React from 'react';
import UserItem from 'components/common/UserItem';

export default ({ items }) => {
  const RowTable = ({ item }) => {
    return (
      <tr>
        <td>
          <LinkTopicTitle data={item.post} category={item.post.category} />
        </td>
        <td>
          <div className="flex">
            {item.post.contributors.slice(0, 2).map((i) => (
              <Link to={`${ROUTES.PROFILE}/${i?.displayName.toLowerCase()}`} className="avatar" key={i._id}>
                <UserItem user={i} size="md" />
              </Link>
            ))}
          </div>
        </td>
        <td className="text-center">{/*{item.repliesNo}*/}</td>
        <td className="text-center">{item.views}</td>
        <td className="text-center">{timeAgoFormat(item.lastModified)}</td>
      </tr>
    );
  };

  return (
    <>
      {!!items.data.length && (
        <div className="w-full overflow-auto table-responsive">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-left">Topic</th>
                <th></th>
                <th>Replies</th>
                <th>Views</th>
                <th>Activity</th>
              </tr>
            </thead>
            <tbody>
              {items.data.map((i) => (
                <RowTable item={i} key={i._id} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};
