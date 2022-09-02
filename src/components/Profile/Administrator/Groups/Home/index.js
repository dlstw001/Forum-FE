import { addQueryParams, removeQueryParams } from 'utils';
import { debounce, isEmpty } from 'lodash';
import { inject, observer } from 'mobx-react';
import { removeEmpty } from 'utils';
import Breadcrumb from 'components/common/Breadcrumb';
import DashboardSectionList from '../../../DashboardSectionList';
import Dropdown from 'components/common/Dropdown';
import DropdownMenu from 'components/common/DropdownMenu';
import GroupModal from 'components/common/modals/Groups/GroupModal';
import MobileMenu from 'components/Profile/MobileMenu';
import qs from 'query-string';
import React from 'react';
import Sorting from 'components/common/Sorting';
import Table from './Table';
import useToggle from 'hooks/useToggle';

const DEFAULT_PAGE_SIZE = 25;
const DEFAULT_PAGE_INDEX = 0;
const DEFAULT_SELECTED_TYPE = 'all';

const TABS = [
  { label: 'All', value: DEFAULT_SELECTED_TYPE },
  { label: 'My Groups', value: 'mine' },
  { label: 'Groups I own', value: 'own' },
  { label: 'Public Groups', value: 'public' },
  { label: 'Closed Groups', value: 'closed' },
  { label: 'Automatic Groups', value: 'auto' },
];

const Groups = ({ groupStore, userStore, history }) => {
  const { type, name, page, pageSize } = qs.parse(history.location.search);
  const [selectedType, setSelectedType] = React.useState(type || DEFAULT_SELECTED_TYPE);
  const [items, setItems] = React.useState({ data: [] });
  const [isLoading, setIsLoading] = React.useState(false);
  const { handleToggle, toggle } = useToggle({
    createGroupModal: false,
  });

  const [filters, setFilters] = React.useState({
    name: name || '',
    pageSize: pageSize || DEFAULT_PAGE_SIZE,
    pageIndex: page - 1 || DEFAULT_PAGE_INDEX,
  });

  const sortingParams = React.useMemo(() => {
    switch (selectedType) {
      case 'mine':
        return { user: userStore.user && userStore.user._id };
      case 'own':
        return { user: userStore.user && userStore.user._id, owner: true };
      case 'public':
        return { allow_membership_requests: true };
      case 'closed':
        return { mentionable_level: 0, messageable_level: 0 };
      case 'auto':
        return { isSystem: true };
      case 'all':
      default:
        return {};
    }
  }, [selectedType, userStore.user]);

  const getData = React.useCallback(async () => {
    setIsLoading(true);
    const payload = {
      ...sortingParams,
      page: filters.pageIndex + 1,
      limit: filters.pageSize,
      name: filters.name,
    };

    setItems({ data: [] });
    await groupStore.find(removeEmpty(payload)).then((res) => {
      setItems(res);
      setIsLoading(false);
    });
  }, [sortingParams, filters.pageIndex, filters.pageSize, filters.name, groupStore]);

  const fetchData = React.useCallback((options) => {
    setFilters((prevState) => ({ ...prevState, ...options }));
  }, []);

  const addOrRemoveParams = React.useCallback(
    (key, value, condition) => {
      condition ? addQueryParams(key, value, history) : removeQueryParams(key, history);
    },
    [history]
  );

  const onChangeType = (tab) => {
    setSelectedType(tab);
    fetchData({ pageIndex: DEFAULT_PAGE_INDEX, pageSize: DEFAULT_PAGE_SIZE });
  };

  const onChangeInput = debounce((name) => {
    fetchData({ name, pageIndex: DEFAULT_PAGE_INDEX, pageSize: DEFAULT_PAGE_SIZE });
  }, 300);

  const DROPDOWN_BUTTONS = [
    {
      label: 'Create Group',
      handler: () => handleToggle({ createGroupModal: !toggle.createGroupModal }),
      'data-cy': 'groups_create',
    },
  ];

  React.useEffect(() => {
    addOrRemoveParams('type', selectedType, !isEmpty(selectedType) && selectedType !== DEFAULT_SELECTED_TYPE);
    addOrRemoveParams('name', filters.name, !isEmpty(filters?.name));
    addOrRemoveParams('page', Number(filters.pageIndex + 1), filters.pageIndex > DEFAULT_PAGE_INDEX);
    addOrRemoveParams('pageSize', filters.pageSize, filters.pageSize !== DEFAULT_PAGE_SIZE);

    sessionStorage.setItem('backHref', JSON.stringify(history.location));
  }, [addOrRemoveParams, filters.name, filters.pageIndex, filters.pageSize, history, selectedType]);

  React.useEffect(() => {
    getData();
  }, [getData]);

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
            onChange={(e) => onChangeInput(e.target.value)}
            data-cy="search"
          />
          <div className="flex mb-4">
            <div className="font-semibold">Total: {items.total} groups</div>
            <div className="ml-auto">
              <Sorting tabs={TABS} current={selectedType} onClick={onChangeType} />
            </div>
          </div>
          <Table
            data={items.data}
            options={{
              disabledProp: 'disabled',
              fetchData: fetchData,
              pageCount: items.total_page,
              filters: filters,
              isLoading: isLoading,
            }}
          />
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
