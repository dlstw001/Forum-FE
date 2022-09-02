import { dateFormat } from 'utils';
import { inject, observer } from 'mobx-react';
import { isEmpty, isEqual } from 'lodash';
import { Link } from 'react-router-dom';
import { removeEmpty } from 'utils';
import { ROUTES } from 'definitions';
import { useHistory, useParams } from 'react-router';
import cx from 'classnames';
import React from 'react';
import ReactTable from 'components/common/ReactTable';
import UserItem from 'components/common/UserItem';

const TABS = [
  { value: 'inbox', label: 'Inbox' },
  { value: 'sent', label: 'Sent' },
  { value: 'archive', label: 'Archive' },
];

const Message = ({ messageStore }) => {
  const history = useHistory();
  const params = useParams();
  const { displayName, type } = params;
  const [items, setItems] = React.useState({ data: [] });
  const [isLoading, setIsLoading] = React.useState(false);
  const [filters, setFilters] = React.useState({
    pageSize: 25,
    pageIndex: 0,
    sortBy: [{ id: 'createdAt', desc: true }],
  });

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
        <Link to={`${ROUTES.USERS}/${displayName}/message/read/${original._id}`} className="flex items-center">
          <span>{original.title}</span>
        </Link>
      ),
    },
    {
      accessor: 'author',
      style: { width: '30%' },
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
      className: 'text-center',
    },
    {
      accessor: 'createdAt',
      Header: 'Created',
      style: { width: '10%' },
      className: 'text-right',
      Cell: ({
        cell: {
          row: { original },
        },
      }) => dateFormat(original.createdAt),
    },
  ];

  const getData = React.useCallback(async () => {
    const { sorting, sortBy, title } = filters;
    const order_by = sorting?.order_by ? sorting?.order_by : sortBy?.[0]?.desc ? 'desc' : 'asc';

    const payload = {
      title: title,
      page: filters.pageIndex + 1,
      limit: filters.pageSize,
      sort_by: sorting?.sort_by || sortBy?.[0]?.id,
      order_by: order_by,
    };

    const apiEndpoint =
      type === 'inbox'
        ? messageStore.findMy
        : type === 'sent'
        ? messageStore.sentMy
        : type === 'archive'
        ? messageStore.getArchiveMy
        : messageStore.findMy;

    setIsLoading(true);
    apiEndpoint(removeEmpty(payload)).then((res) => {
      setItems(res);
      setIsLoading(false);
    });
  }, [filters, messageStore.findMy, messageStore.getArchiveMy, messageStore.sentMy, type]);

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

  React.useEffect(() => {
    getData();
  }, [getData]);

  React.useEffect(() => {
    if (isEmpty(params.type)) {
      history.push(`${ROUTES.USERS}/${displayName}/message/inbox`);
    }
  }, [displayName, history, params.type]);

  return (
    <div className="flex">
      <div className="w-1/6">
        <ul>
          {TABS.map((tab) => (
            <li key={tab.value} className="mb-2">
              <Link
                to={`${ROUTES.USERS}/${displayName}/message/${tab.value}`}
                className={cx('anchor font-semibold text-xl', { 'text-primary': tab.value === type })}
              >
                {tab.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-5/6">
        <div className="w-full">
          <ReactTable
            columns={columns}
            data={items.data}
            options={{
              isMulti: true,
              disabledProp: 'disabled',
              fetchData: fetchData,
              pageCount: items.total_page,
              filters: filters,
              isLoading: isLoading,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default inject(({ messageStore }) => ({ messageStore }))(observer(Message));
