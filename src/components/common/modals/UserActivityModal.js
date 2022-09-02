import { isEqual } from 'lodash';
import { Link } from 'react-router-dom';
import { Modal, ModalHeader } from 'components/common/Modal';
import { ROUTES } from 'definitions';
import React from 'react';
import ReactTable from 'components/common/ReactTable';
import UserItem from 'components/common/UserItem';

const UserActivityModal = ({ activityName, data, onToggle }) => {
  const [filters, setFilters] = React.useState({
    pageSize: 10,
    pageIndex: 0,
    sortBy: [{ id: 'rank', desc: false }],
  });

  const [items, setItems] = React.useState([]);

  const title = activityName.split(/(?=[A-Z])/).join(' ');

  // Get activity key from data object for accessor field in columns below
  let keys;
  let statsAccessor;
  if (data[activityName]['value']['data'][0]) {
    keys = Object.keys(data[activityName]['value']['data'][0]);
    statsAccessor = keys.find(
      (ele) => ele.endsWith('Post') || ele.endsWith('Reply') || ele.endsWith('View') || ele.endsWith('Like')
    );
  }

  const pageCount = data[activityName]['value']['data'].length / filters.pageSize;

  // Add new column - "Rank" for the data
  data[activityName]['value']['data'].map((ele, index) => (ele['rank'] = index + 1));

  // Create table options - "columns" for useTable hook for react-table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Rank',
        accessor: 'rank',
        className: 'text-center w-1/12 pointer-events-none',
        sortable: false,
      },
      {
        Header: 'Username',
        accessor: 'name',
        sortable: false,
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
        Header: 'Display Name',
        accessor: 'displayName',
        className: 'pointer-events-none',
        sortable: false,
      },
      {
        Header: 'Email',
        accessor: 'email',
        className: 'pointer-events-none',
        sortable: false,
      },
      {
        Header: 'Total ' + title.split(' ').splice(1).join(' '),
        accessor: statsAccessor.toString(),
        className: 'text-center pointer-events-none',
        sortable: false,
      },
    ],
    [title, statsAccessor]
  );

  // Fetch data based on changes of state - "filters"
  const fetchData = React.useCallback((options) => {
    setFilters((prevState) => {
      // If the sorting was changed, return to page 1.
      if (isEqual(prevState?.sorting, options?.sorting)) {
        return { ...prevState, ...options };
      } else {
        return { ...prevState, ...options, pageIndex: 0 };
      }
    });
  }, []);

  // Separate data by pages and set which page to be show up
  const getData = React.useCallback(() => {
    let dataByPage = [];
    let k = -1;
    data[activityName]['value']['data'].map((ele, index) => {
      if (index % filters.pageSize === 0) {
        k++;
        dataByPage[k] = [];
      }
      return dataByPage[k].push(ele);
    });

    setItems(dataByPage[filters.pageIndex]);
  }, [activityName, data, filters.pageIndex, filters.pageSize]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Modal size="lg" containerClass="overflow-auto bg-secondary" onToggle={onToggle}>
      <div className="modal-contributors">
        <ModalHeader onToggle={onToggle} className={{ 'border-b': false }}>
          {title}
        </ModalHeader>
        <div className="mb-4">
          <ReactTable
            columns={columns}
            data={items}
            options={{
              fetchData,
              filters,
              pageCount,
              hidePageCountSelector: true,
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default UserActivityModal;
