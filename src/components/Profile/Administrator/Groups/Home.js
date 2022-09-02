import { addQueryParams, removeQueryParams } from 'utils';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { removeEmpty } from 'utils';
import Breadcrumb from 'components/common/Breadcrumb';
import DashboardSectionList from '../../DashboardSectionList';
import Dropdown from 'components/common/Dropdown';
import DropdownMenu from 'components/common/DropdownMenu';
import GroupModal from 'components/common/modals/Groups/GroupModal';
import Loading from 'components/common/Loading';
import MobileMenu from 'components/Profile/MobileMenu';
import qs from 'query-string';
import React from 'react';
import Sorting from 'components/common/Sorting';
import useToggle from 'hooks/useToggle';

const TABS = [
  { label: 'All', value: '0' },
  { label: 'My Groups', value: '1' },
  { label: 'Groups I own', value: '2' },
  { label: 'Public Groups', value: '3' },
  { label: 'Closed Groups', value: '4' },
  { label: 'Automatic Groups', value: '5' },
];

const Groups = ({ groupStore, userStore, match, history }) => {
  const { type, term } = qs.parse(history.location.search);
  const [selectedTab, setSelectedTab] = React.useState(type || '0');
  const [items, setItems] = React.useState({ data: [] });
  const [isBottom, setIsBottom] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { handleToggle, toggle } = useToggle({
    createGroupModal: false,
  });

  const [filters, setFilters] = React.useState({
    pageSize: 20,
    pageIndex: 1,
  });
  const [advanceFilters, setAdvanceFilters] = React.useState({ name: term });

  const sortingParams = React.useMemo(() => {
    switch (selectedTab) {
      case '0':
        break;
      case '1':
        return { user: userStore.user && userStore.user._id };
      case '2':
        return { user: userStore.user && userStore.user._id, owner: true };
      case '3':
        return { allow_membership_requests: true };
      case '4':
        return { mentionable_level: 0, messageable_level: 0 };
      case '5':
        return { isSystem: true };
      default:
        return {};
    }
  }, [selectedTab, userStore.user]);

  const getData = React.useCallback(async () => {
    setIsLoading(true);
    const payload = {
      ...advanceFilters,
      ...sortingParams,
      page: filters.pageIndex,
      limit: filters.pageSize,
    };

    await groupStore.find(removeEmpty(payload)).then((res) => {
      setItems((prevState) => {
        const { data, ...rest } = prevState;

        return {
          ...rest,
          ...res,
          data: [
            ...data,
            ...res.data.map((i) => ({
              ...i.document,
              ...i,
            })),
          ],
        };
      });
      setIsLoading(false);
    });
  }, [groupStore, advanceFilters, sortingParams, filters.pageIndex, filters.pageSize]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  const fetchData = React.useCallback((options) => {
    setFilters((prevState) => ({ ...prevState, ...options }));
  }, []);

  const isScrolling = () => {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    if (scrollTop + window.innerHeight + 50 < scrollHeight) {
      setIsBottom(false);
    } else {
      setIsBottom(true);
    }
  };

  React.useEffect(() => {
    if (selectedTab) {
      addQueryParams('type', selectedTab, history);
    }
  }, [history, selectedTab]);

  React.useEffect(() => {
    if (advanceFilters?.title) {
      addQueryParams('term', advanceFilters?.title, history);
    } else {
      removeQueryParams('term', history);
    }
  }, [advanceFilters, history]);

  const onChangeTab = (tab) => {
    setFilters({ pageIndex: 1, pageSize: 10 });
    setItems({ data: [] });
    setSelectedTab(tab);
  };

  React.useEffect(() => {
    window.addEventListener('scroll', isScrolling);
    return () => window.removeEventListener('scroll', isScrolling);
  }, []);

  React.useEffect(() => {
    if (isBottom && items.total_page >= filters.pageIndex && !isLoading) {
      setIsBottom(false);
      fetchData({ pageIndex: filters.pageIndex + 1 });
    }
  }, [fetchData, filters.pageIndex, isBottom, items.total_page, isLoading]);

  const onChangeAdvanceFilters = (name) => {
    setFilters({ pageIndex: 1, pageSize: 20 });
    setItems({ data: [] });
    setAdvanceFilters(name);
  };

  const DROPDOWN_BUTTONS = [
    {
      label: 'Create Group',
      handler: () => handleToggle({ createGroupModal: !toggle.createGroupModal }),
      'data-cy': 'groups_create',
    },
  ];

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

  return (
    <>
      <main className="container wrapper lg:flex">
        <DashboardSectionList isAdmin={true} className="hidden lg:block" />
        <div className="flex-grow">
          <Breadcrumb title={`Groups`} className="mb-8" />
          <MobileMenu isAdmin title="Groups">
            <Dropdown
              placement="bottom-end"
              menuClassname="text-black action-menu"
              className="flex items-center h-full ml-auto"
              menu={({ style }) => (
                <ul className="text-gray-500 bg-secondary menu" style={style}>
                  {DROPDOWN_BUTTONS.map((i) => (
                    <DropdownMenu key={i.label} item={i} handleClick={i.handler} />
                  ))}
                </ul>
              )}
            >
              <i className="ml-auto material-icons btn-action" data-cy="action_menu_dropdown">
                more_vert
              </i>
            </Dropdown>
          </MobileMenu>
          <input
            className="flex w-full mt-6 mb-16 input-search"
            type="text"
            placeholder="Search"
            onChange={(e) => onChangeAdvanceFilters({ name: e.target.value })}
            data-cy="search"
          />
          <div className="flex mb-4">
            <div className="font-semibold">Total: {items.total} groups</div>
            <div className="ml-auto">
              <Sorting tabs={TABS} current={selectedTab} onClick={onChangeTab} />
            </div>
          </div>
          <div className="relative mb-12">
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="text-left">Group</th>
                  <th>No. of Users</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.data.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <Link to={`${match.url}/${item.name}?tab=members`} data-cy={`${item.name}`}>
                        {item.name}
                      </Link>
                    </td>
                    <td className="text-center">{item.noUsers}</td>
                    <td className="text-center">{groupStatus(item)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {isLoading && <Loading />}
          </div>
        </div>
      </main>
      {toggle.createGroupModal && (
        <GroupModal
          onToggle={(show) => {
            handleToggle({ createGroupModal: show || !toggle.createGroupModal });
          }}
        />
      )}
    </>
  );
};

export default inject(({ groupStore, userStore }) => ({ groupStore, userStore }))(observer(Groups));
