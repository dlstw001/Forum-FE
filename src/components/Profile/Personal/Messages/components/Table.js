import { dateFormat, getMessageUrl } from 'utils';
import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import React from 'react';
import ReactTable from 'components/common/ReactTable';
import UserItem from 'components/common/UserItem';

export default ({ items, onSelect, fetchData, filters, isLoading }) => {
  const columns = [
    {
      accessor: 'title',
      Header: 'Topic',
      style: { width: '50%' },
      Cell: ({
        cell: {
          row: { original },
        },
      }) => (
        <Link to={getMessageUrl(original)} className="flex items-center">
          <span>{original.title}</span>
        </Link>
      ),
    },
    {
      accessor: 'author',
      style: { width: '30%' },
      className: 'text-center pointer-events-none',

      Cell: ({
        cell: {
          row: { original },
        },
      }) => (
        <div className="flex">
          {original.contributors.slice(0, 2).map((i) => (
            <Link to={`${ROUTES.PROFILE}/${i?.displayName?.toLowerCase()}`} key={i._id}>
              <UserItem user={i} size="sm" className="mr-2" />
            </Link>
          ))}
        </div>
      ),
    },
    {
      accessor: 'noReplies',
      Header: 'Replies',
      style: { width: '10%' },
      className: 'text-center pointer-events-none',
    },
    {
      accessor: 'lastModified',
      Header: 'Last Activity',
      style: { width: '10%' },
      className: 'text-right',
      headerClassName: 'whitespace-no-wrap',
      Cell: ({
        cell: {
          row: { original },
        },
      }) => dateFormat(original.lastModified),
    },
  ];

  return (
    <>
      <div className="w-full">
        <ReactTable
          columns={columns}
          data={items.data}
          options={{
            isMulti: true,
            onSelectionChanged: onSelect,
            disabledProp: 'disabled',
            fetchData: fetchData,
            pageCount: items.total_page,
            filters: filters,
            isLoading: isLoading,
          }}
        />
      </div>
    </>
  );
};
