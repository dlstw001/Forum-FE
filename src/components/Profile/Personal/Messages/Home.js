import { addQueryParams, removeQueryParams } from 'utils';
import { debounce, isEmpty } from 'lodash';
import { inject, observer } from 'mobx-react';
import { isEqual } from 'lodash';
import { removeEmpty } from 'utils';
import { withRouter } from 'react-router-dom';
import Breadcrumb from 'components/common/Breadcrumb';
import CreateMessageModal from 'components/common/modals/CreateMessageModal';
import cx from 'classnames';
import DashboardSectionList from '../../DashboardSectionList';
import MobileDropdownButton from 'components/common/MobileDropdownButton';
import MobileMenu from 'components/Profile/MobileMenu';
import qs from 'query-string';
import React from 'react';
import Table from './components/Table';
import Tabs from 'components/common/Tabs';
import Tooltip from 'components/common/Tooltip';
import useToggle from 'hooks/useToggle';

const TAB = {
  INBOX: 'inbox',
  SENT: 'sent',
  ARCHIVE: 'archive',
};
const TABS = [
  { value: TAB.INBOX, label: 'Inbox', 'data-cy': 'messages_inbox_tab' },
  { value: TAB.SENT, label: 'Sent', 'data-cy': 'messages_sent_tab' },
  { value: TAB.ARCHIVE, label: 'Archive', 'data-cy': 'messages_archive_tab' },
];

const DEFAULT_PAGESIZE = 25;
const DEFAULT_SORTBY = 'lastModified';
const DEFAULT_ORDERBY = 'desc';

const Messages = ({ history, messageStore }) => {
  const { tab, term, page = 0, sortBy, orderBy, pageSize } = qs.parse(history.location.search);
  const [items, setItems] = React.useState({ data: [] });
  const [selected, setSelected] = React.useState([]);
  const [filters, setFilters] = React.useState({
    pageSize: pageSize || DEFAULT_PAGESIZE,
    pageIndex: page ? page - 1 : 0,
    sortBy: [{ id: sortBy || DEFAULT_SORTBY, desc: orderBy ? orderBy === DEFAULT_ORDERBY : true }],
    title: term,
    tab: tab || TAB.INBOX,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const { handleToggle, toggle } = useToggle({
    createMessageModal: false,
    archiveMessage: false,
    restoreMessage: false,
    deleteMessage: false,
  });

  const getData = React.useCallback(async () => {
    const { sorting, sortBy, title, tab } = filters;
    const order_by = sortBy?.[0]?.desc ? 'desc' : 'asc';

    const payload = {
      page: filters.pageIndex + 1,
      limit: filters.pageSize,
      sort_by: sorting?.sort_by || sortBy?.[0]?.id,
      order_by: order_by,
      title,
    };

    let method;
    switch (tab) {
      case TAB.SENT:
        method = messageStore.sentMy;
        break;
      case TAB.ARCHIVE:
        method = messageStore.getArchiveMy;
        break;
      default:
        method = messageStore.findMy;
        break;
    }

    setIsLoading(true);
    const res = await method(removeEmpty(payload));
    setItems(res);
    setIsLoading(false);
  }, [filters, messageStore]);

  const handleSelect = React.useCallback(
    (selection) => {
      if (!isEqual(selected, selection)) {
        const filtered = selection.filter((i) => !i.disabled);
        setSelected(filtered);
      }
    },
    [selected]
  );

  const handleFunction = async () => {
    const method = tab === TAB.ARCHIVE ? messageStore.unarchive : messageStore.archive;

    await selected.map(
      async (i) =>
        await method(i._id).then(() => {
          setItems({ data: [] });
          getData();
        })
    );
  };

  const onChangeAdvanceFilters = debounce((title) => {
    setItems({ data: [] });
    fetchData({ pageIndex: 0, title: title });
  }, 300);

  const fetchData = React.useCallback((options) => {
    setFilters((prevState) => ({ ...prevState, ...options }));
  }, []);

  const onUpdateTable = React.useCallback(
    (options) =>
      setFilters((prevState) => {
        if (options?.sorting)
          if (isEqual(prevState?.sorting, options?.sorting)) return { ...prevState, ...options };
          else return { ...prevState, ...options, pageIndex: 0 };
        else return { ...prevState, ...options };
      }),
    []
  );

  const onChangeTab = (tab) => {
    setItems({ data: [] });
    removeQueryParams('page', history);
    fetchData({
      pageIndex: 0,
      tab,
      sorting: { order_by: DEFAULT_ORDERBY, sort_by: DEFAULT_SORTBY },
      pageSize: DEFAULT_PAGESIZE,
    });
  };

  const addOrRemoveParams = React.useCallback(
    (key, value, condition) => {
      condition ? addQueryParams(key, value, history) : removeQueryParams(key, history);
    },
    [history]
  );

  React.useEffect(() => {
    getData();
  }, [getData]);

  React.useEffect(() => {
    addOrRemoveParams('tab', filters.tab, !isEmpty(filters.tab));
    addOrRemoveParams('page', filters.pageIndex + 1, !!filters.pageIndex);
    addOrRemoveParams('term', filters.title, !isEmpty(filters.title));
    addOrRemoveParams('pageSize', filters.pageSize, filters.pageSize !== DEFAULT_PAGESIZE);

    if (filters?.sorting) {
      addOrRemoveParams('sortBy', filters.sorting.sort_by, filters.sorting.sort_by !== DEFAULT_SORTBY);
      addOrRemoveParams('orderBy', filters.sorting.order_by, filters.sorting.order_by !== DEFAULT_ORDERBY);
    } else if (filters?.sortBy) {
      addOrRemoveParams('sortBy', filters.sortBy[0].id, filters.sortBy[0].id !== DEFAULT_SORTBY);
      addOrRemoveParams('orderBy', 'asc', !filters.sortBy[0].desc);
    } else {
      removeQueryParams('sortBy', history);
      removeQueryParams('orderBy', history);
    }
    sessionStorage.setItem('backHref', JSON.stringify(history.location));
  }, [addOrRemoveParams, filters, history]);

  return (
    <>
      <main className="container relative wrapper lg:flex">
        <DashboardSectionList className="hidden lg:block" isPersonal={true} />

        <div className="flex flex-col w-full">
          <Breadcrumb title={`Private Messages`} className="mb-8" />
          <MobileMenu title="Messages" isPersonal={true}></MobileMenu>
          <input
            className="mb-4 input-search"
            type="text"
            placeholder="Search"
            onChange={(e) => onChangeAdvanceFilters(e.target.value)}
            data-cy="search"
            defaultValue={term}
          />
          <button
            className="inline-flex btn btn-primary write-msg-mob"
            onClick={() => handleToggle({ createMessageModal: !toggle.createMessageModal })}
          >
            <span className="material-icons-outlined">edit</span>
          </button>
          <MobileDropdownButton
            className="flex justify-between lg:hidden"
            title={TABS.find((i) => i.value === filters.tab).label}
            isOpen={toggle.mobileMenu}
            onToggle={() => handleToggle({ mobileMenu: !toggle.mobileMenu })}
          />

          <div className={cx('p-4 lg:p-0 bg-gray-50 lg:bg-transparent lg:block', { hidden: !toggle.mobileMenu })}>
            <div className="flex lg:hidden">
              <button onClick={() => handleToggle({ mobileMenu: false })} className="ml-auto material-icons">
                close
              </button>
            </div>
            <div className="flex flex-col justify-between">
              <div className="flex items-center">
                <Tabs tabs={TABS} current={filters.tab} onClick={(val) => onChangeTab(val)}></Tabs>
              </div>
            </div>
          </div>
          <button
            className="flex items-center ml-auto btn-primary btn write-msg"
            onClick={() => handleToggle({ createMessageModal: !toggle.createMessageModal })}
          >
            <span className="mr-2 material-icons-outlined">edit</span>
            Write Message
          </button>
          <div className="flex items-center mb-6">
            <span className="font-semibold">
              Total: {items.total} message{items.total > 1 && `s`}
            </span>
            <Tooltip
              placement="top"
              className="ml-auto"
              modifiers={[
                {
                  name: 'offset',
                  options: {
                    offset: [0, 5],
                  },
                },
              ]}
              containerClassName="bg-secondary py-2 px-4 rounded z-20"
              tooltip={tab === TAB.ARCHIVE ? 'Unarchive' : 'Archive'}
            >
              <button
                disabled={!selected.length}
                onClick={() => handleFunction('archive')}
                className="flex ml-auto btn btn-icon"
                data-cy="user_messages_dropdown"
              >
                <i className="material-icons-outlined">move_to_inbox</i>
              </button>
            </Tooltip>
          </div>

          <Table
            items={items}
            archiveMessage={tab === 'archive' ? toggle.restoreMessage : toggle.archiveMessage}
            deleteMessage={toggle.deleteMessage}
            onSelect={handleSelect}
            fetchData={onUpdateTable}
            filters={filters}
            isLoading={isLoading}
          />
        </div>
      </main>

      {toggle.createMessageModal && (
        <CreateMessageModal
          onToggle={(show) => {
            handleToggle({ createMessageModal: show || !toggle.createMessageModal });
          }}
          callBack={getData}
        />
      )}
    </>
  );
};

export default inject(({ messageStore }) => ({
  messageStore,
}))(withRouter(observer(Messages)));
