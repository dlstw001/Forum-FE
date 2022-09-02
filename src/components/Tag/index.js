import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { removeEmpty } from 'utils';
import { ROUTES } from 'definitions';
import Breadcrumb from 'components/common/Breadcrumb';
import CreateTagModal from 'components/common/modals/CreateTagModal';
import Delete from './Delete';
import Dropdown from 'components/common/Dropdown';
import DropdownMenu from 'components/common/DropdownMenu';
import qs from 'query-string';
import React from 'react';
import Sorting from 'components/common/Sorting';
import useToggle from 'hooks/useToggle';

const TagItem = ({ item }) => {
  return (
    <div className="items-center xflex" data-cy="tag_itself">
      <Link className="mr-2 tags" to={`${ROUTES.TOPIC}?tab=findByTag&tag=${item.name}`}>
        {item.name}
      </Link>
      x {item.count}
    </div>
  );
};

const TABS = [
  { label: 'Count', value: 'count', id: 'ascCount' },
  { label: 'Name', value: 'name', id: 'ascName' },
];

const Tag = ({ tagStore, userStore, history }) => {
  const { type, term } = qs.parse(history.location.search);
  const [selectedTab, setSelectedTab] = React.useState(type || 'count');
  const [advanceFilters, setAdvanceFilters] = React.useState({ displayName: term });
  const [items, setItems] = React.useState({ data: [] });
  const { handleToggle, toggle } = useToggle({
    createTagModal: false,
    deleteTags: false,
  });
  const [filters, setFilters] = React.useState({
    pageSize: 1000,
    pageIndex: 1,
  });

  const sortingParams = React.useMemo(() => {
    switch (selectedTab) {
      case 'name':
        return { order_by: 'asc', sort_by: 'name' };
      case 'count':
      default:
        return {};
    }
  }, [selectedTab]);

  const getData = React.useCallback(async () => {
    const payload = {
      ...advanceFilters,
      ...sortingParams,
      page: filters.pageIndex,
      limit: filters.pageSize,
    };

    const apiEndpoint = selectedTab === 'name' ? tagStore.find : tagStore.tagListByCount;

    await apiEndpoint(removeEmpty(payload)).then((res) => setItems(res));
  }, [tagStore, filters.pageIndex, filters.pageSize, advanceFilters, sortingParams, selectedTab]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  const onToggleDelete = () => {
    handleToggle({ deleteTags: !toggle.deleteTags });
    getData();
  };

  const DROPDOWN_BUTTONS = [
    {
      label: 'create tag',
      handler: () => handleToggle({ createTagModal: !toggle.createTagModal }),
      'data-cy': 'create_tag_btn',
    },
    {
      label: 'delete tag',
      handler: () => handleToggle({ deleteTags: !toggle.deleteTags }),
      'data-cy': 'delete_tag_btn',
    },
  ];

  const onChangeTab = (tab) => {
    setFilters({ pageIndex: 1, pageSize: 1000 });
    setItems({ data: [] });
    setSelectedTab(tab);
  };

  const onChangeAdvanceFilters = (name) => {
    setFilters({ pageIndex: 1, pageSize: 1000 });
    setItems({ data: [] });
    setAdvanceFilters(name);
  };

  return (
    <>
      <main className="container wrapper">
        <Breadcrumb title={`Tags`} className="mb-8" />
        <div className="flex">
          <h2 className="mb-12 page-title">Tags</h2>
          {userStore.IS_ADMIN_OR_MODERATOR && (
            <Dropdown
              placement="bottom-end"
              menuClassname="action-menu"
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
          )}
        </div>
        <input
          className="flex w-full mb-12 input-search"
          type="text"
          placeholder="Search"
          onChange={(e) => onChangeAdvanceFilters({ name: e.target.value })}
          data-cy="search"
        />
        <div className="flex mb-4">
          <div className="font-semibold">Total: {items.total ? items.total : items.data.length} Tags</div>
          <div className="ml-auto">
            <Sorting tabs={TABS} current={selectedTab} onClick={onChangeTab} />
          </div>
        </div>

        {!toggle.deleteTags && (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.data.map((item) => (
                <TagItem key={item._id} item={item} />
              ))}
            </div>
          </>
        )}
        {toggle.deleteTags && <Delete items={items.data} onToggle={onToggleDelete} />}
      </main>
      {toggle.createTagModal && (
        <CreateTagModal
          onToggle={(show) => {
            handleToggle({ createTagModal: show || !toggle.createTagModal });
          }}
          onSuccess={getData}
        />
      )}
    </>
  );
};

export default inject(({ tagStore, userStore }) => ({ tagStore, userStore }))(observer(Tag));
