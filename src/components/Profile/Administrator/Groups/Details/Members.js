import { dateFormat } from 'utils';
import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import React from 'react';
import ReactTable from 'components/common/ReactTable';
import UserItem from 'components/common/UserItem';

export default ({ data }) => {
  const [filter, setFilter] = React.useState('');
  const filteredData = React.useMemo(() => {
    return data.filter((i) => {
      const displayName = i.displayName.toLowerCase();
      const displayNameFilter = filter.toLowerCase();

      return displayName.includes(displayNameFilter);
    });
  }, [data, filter]);

  const columns = [
    {
      accessor: 'name',
      Header: 'Username',
      Cell: ({
        cell: {
          row: { original },
        },
      }) => (
        <Link to={`${ROUTES.USERS}/${original.displayName.toLowerCase()}`} className="flex items-center">
          <UserItem user={original} size="md" />
          <span>{original.displayName}</span>
        </Link>
      ),
    },
    {
      accessor: 'lastSeen',
      Header: 'Seen',
      className: 'text-center',
      Cell: ({
        cell: {
          row: { original },
        },
      }) => dateFormat(original.lastSeen),
    },
    {
      accessor: 'noViews',
      Header: 'Topics Viewed',
      className: 'text-center',
    },
    {
      accessor: 'noLikeReceived',
      Header: (
        <div className="flex items-center">
          <i className="mr-2 material-icons md-18 btn-liked">favorite</i> Received
        </div>
      ),
      className: 'text-center',
    },
    {
      accessor: 'noLikeGiven',
      Header: (
        <div className="flex items-center">
          <i className="mr-2 material-icons md-18 btn-liked">favorite</i> Given
        </div>
      ),
      className: 'text-center',
    },
    {
      accessor: 'createdAt',
      Header: 'Created',
      className: 'text-right',
      Cell: ({
        cell: {
          row: { original },
        },
      }) => dateFormat(original.createdAt),
    },
  ];

  return (
    <>
      <div className="mb-8 font-semibold">Total: {data?.length} members</div>
      <input
        className="flex w-full mt-6 mb-16 input-search"
        type="text"
        placeholder="Search"
        onChange={(e) => setFilter(e.target.value)}
        data-cy="search"
      />
      <div className="w-full">
        <ReactTable columns={columns} data={filteredData} />
      </div>
    </>
  );
};
