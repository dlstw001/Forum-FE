import { inject, observer } from 'mobx-react';
import { isEqual } from 'lodash';
import Breadcrumb from 'components/common/Breadcrumb';
import Details from './Details';
import Dropdown from 'components/common/Dropdown';
import DropdownMenu from 'components/common/DropdownMenu';
import React from 'react';

const STATUS = {
  ALL: 'all',
  UNREAD: 'unread',
  READ: 'read',
};
const STATUS_OPTIONS = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Unread',
    value: 'unread',
  },
  {
    label: 'Read',
    value: 'read',
  },
];
const Notifications = ({ notificationStore }) => {
  const [items, setItems] = React.useState({ data: [] });
  const [selected, setSelected] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const [filters, setFilters] = React.useState({
    pageIndex: 0,
    pageSize: 25,
    sortBy: [{ id: 'createdAt', desc: true }],
  });

  const getData = React.useCallback(async () => {
    setIsLoading(true);
    const { sorting, sortBy } = filters;
    const order_by = sorting?.order_by ? sorting?.order_by : sortBy[0]?.desc ? 'desc' : 'asc';
    const payload = {
      page: filters.pageIndex + 1,
      limit: filters.pageSize,
      sort_by: sorting?.sort_by || sortBy[0]?.id,
      order_by: order_by,
      isRead: filters.isRead,
    };

    await notificationStore.find(payload).then((res) => {
      setItems(res);
      setIsLoading(false);
    });
  }, [filters, notificationStore]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  const handleSelect = React.useCallback(
    (selection) => {
      if (!isEqual(selected, selection)) {
        const filtered = selection.filter((i) => !i.disabled);
        setSelected(filtered);
      }
    },
    [selected]
  );

  const handleFunction = async (type) => {
    if (selected.length) {
      let arr = [];
      selected.map((i) => arr.push(i._id));
      const payload = {
        ids: arr,
      };

      const apiEndpoint =
        type === 'read'
          ? notificationStore.read
          : type === 'unread'
          ? notificationStore.unread
          : type === 'delete'
          ? notificationStore.delete
          : notificationStore.read;

      apiEndpoint(payload).then(() => window.location.reload());
    }
  };

  const DROPDOWN_BUTTONS = [
    {
      label: 'Read Notification',
      handler: () => handleFunction('read'),
    },
    {
      label: 'Unread Notification',
      handler: () => handleFunction('unread'),
    },
    {
      label: 'Delete Notification',
      handler: () => handleFunction('delete'),
    },
  ];

  const fetchData = React.useCallback((options) => {
    setFilters((prevState) => ({ ...prevState, ...options }));
  }, []);

  const handleFilter = (e) => {
    let filter;
    switch (e.target.value) {
      case STATUS.READ:
        filter = { isRead: true };
        break;
      case STATUS.UNREAD:
        filter = { isRead: false };
        break;
      default:
        filter = { isRead: null };
    }
    fetchData(filter);
  };
  return (
    <>
      <main className="container wrapper">
        <Breadcrumb title={`Notifications`} className="mb-8" />
        <div className="flex">
          <div className="page-title">Notifications</div>

          <div className="flex items-center ml-auto">
            Filter By:
            <select className="ml-2" onChange={handleFilter}>
              {STATUS_OPTIONS.map((i, index) => (
                <option key={index} value={i.value}>
                  {i.label}
                </option>
              ))}
            </select>
          </div>

          <Dropdown
            placement="bottom-end"
            menuClassname="action-menu"
            className="flex items-center h-full ml-4"
            menu={({ style }) => (
              <ul className="text-gray-500 bg-secondary menu" style={style}>
                {DROPDOWN_BUTTONS.map((i) => (
                  <DropdownMenu key={i.label} item={i} handleClick={i.handler} />
                ))}
              </ul>
            )}
          >
            <i className="ml-auto material-icons btn-action" data-cy="user_messages_dropdown">
              more_vert
            </i>
          </Dropdown>
        </div>
        <Details items={items} onSelect={handleSelect} isLoading={isLoading} fetchData={fetchData} filters={filters} />
      </main>
    </>
  );
};

export default inject(({ notificationStore }) => ({ notificationStore }))(observer(Notifications));
