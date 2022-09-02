import { dateFormat } from 'utils';
import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import React from 'react';
import ReactTable from 'components/common/ReactTable';
import UserItem from 'components/common/UserItem';

export default ({ data, fetchData, filters }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Username',
        accessor: 'displayName',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return (
            <Link to={`${ROUTES.USERS}/${original.displayName.toLowerCase()}`} className="flex items-center">
              <UserItem user={original} size="sm" className="mr-2" />
              <div>{original.displayName}</div>
            </Link>
          );
        },
      },
      {
        Header: 'Seen',
        accessor: 'lastSeen',
        className: 'text-center',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => dateFormat(original.lastSeen),
      },
      {
        Header: 'Topics Viewed',
        accessor: 'postViews',
        className: 'text-center',
      },
      {
        Header: 'Replies Viewed',
        accessor: 'replyViews',
        className: 'text-center',
      },
      {
        Header: 'Read Time',
        accessor: 'readingTime',
        className: 'text-center',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => original.readingTime && (parseInt(original.readingTime) / 60 / 60).toFixed(2) + 'h',
      },
      {
        Header: 'Responses',
        accessor: 'noReply',
        className: 'text-center pointer-events-none',
        sortable: false,
      },
      {
        Header: (
          <>
            <i className="mr-2 material-icons md-18 btn-liked">favorite</i>Received
          </>
        ),
        accessor: 'noLikeReceived',
        className: 'text-center pointer-events-none',
        sortable: false,
        disableFilters: true,
      },
      {
        Header: (
          <>
            <i className="mr-2 material-icons md-18 btn-liked">favorite</i>Given
          </>
        ),
        accessor: 'noLikeGiven',
        className: 'text-center pointer-events-none',
        sortable: false,
      },
      {
        Header: 'Created',
        accessor: 'createdAt',
        className: 'text-center',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => dateFormat(original.createdAt),
      },
    ],
    []
  );

  return (
    <ReactTable
      columns={columns}
      data={data?.data}
      options={{
        fetchData,
        filters,
        pageCount: data.total_page,
      }}
    />
  );
};
