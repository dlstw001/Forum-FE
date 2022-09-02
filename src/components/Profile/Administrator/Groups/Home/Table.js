import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import React from 'react';
import ReactTable from 'components/common/ReactTable';

const groupStatus = (item) => {
  if (item.allow_membership_requests) {
    return 'Private';
  } else if (item.isMember) {
    return 'Member';
  } else if (!item.mentionable_level && !item.messageable_level) {
    return 'Closed';
  } else if (item.isSystem) {
    return 'Automatic';
  } else if (!item.allow_membership_requests) {
    return 'Open for joining';
  }
};

export default ({ data = [], options = {} }) => {
  const columns = [
    {
      accessor: 'name',
      Header: 'Group',
      Cell: ({
        cell: {
          row: { original },
        },
      }) => (
        <Link to={`${ROUTES.GROUP}/${original.name}`} data-cy={`${original.name}`}>
          {original.name}
        </Link>
      ),
    },
    {
      accessor: 'noUsers',
      Header: 'No. of Users',
      className: 'text-center',
    },
    {
      accessor: 'groupStatus',
      Header: 'Status',
      className: 'text-center',
      Cell: ({
        cell: {
          row: { original },
        },
      }) => groupStatus(original),
    },
  ];

  return (
    <div className="w-full">
      <ReactTable columns={columns} data={data} options={options} />
    </div>
  );
};
