import { addQueryParams, removeQueryParams } from 'utils';
import { inject, observer } from 'mobx-react';
import { ROUTES } from 'definitions';
import Activity from './Activity';
import Breadcrumb from 'components/common/Breadcrumb';
import cx from 'classnames';
import DashboardSectionList from '../../../DashboardSectionList';
import Dropdown from 'components/common/Dropdown';
import DropdownMenu from 'components/common/DropdownMenu';
import GroupModal from 'components/common/modals/Groups/GroupModal';
import Loading from 'components/common/Loading';
import ManageMembers from 'components/common/modals/Groups/ManageMembers';
import Members from './Members';
import MobileDropdownButton from 'components/common/MobileDropdownButton';
import MobileMenu from 'components/Profile/MobileMenu';
import Permissions from './Permissions';
import qs from 'query-string';
import React from 'react';
import ReminderModal from 'components/common/modals/ReminderModal';
import Tabs from 'components/common/Tabs';
import useToggle from 'hooks/useToggle';

const DEFAULT_TAB = 'members';

const TABS = [
  { value: DEFAULT_TAB, label: 'Members', 'data-cy': 'members' },
  { value: 'activity', label: 'Activity', 'data-cy': 'activity' },
  { value: 'permissions', label: 'Permissions', 'data-cy': 'permissions' },
];

const Groups = ({ groupStore, match, history }) => {
  const { slug } = match.params;
  const { tab } = qs.parse(history.location.search);
  const [data, setData] = React.useState({ item: { users: [] } });
  const [selectedTab, setSelectedTab] = React.useState(tab || DEFAULT_TAB);
  const [isLoading, setIsLoading] = React.useState(true);

  const { handleToggle, toggle } = useToggle({
    manageMembersModal: false,
    createGroupModal: false,
    deleteGroupModal: false,
  });

  // const handleGlobalSearch = () => {};

  const getData = React.useCallback(async () => {
    setIsLoading(true);
    await groupStore.get(slug).then((res) => setData(res));

    await groupStore.getUserList(slug).then((res) =>
      setData((prevState) => ({
        ...prevState,
        item: {
          ...prevState.item,
          owners: res.owners,
          users: [...res.users, ...res.owners],
        },
      }))
    );

    setIsLoading(false);
  }, [groupStore, slug]);

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
    addOrRemoveParams('tab', selectedTab, selectedTab !== DEFAULT_TAB);
  }, [addOrRemoveParams, selectedTab]);

  const handleDelete = async () => {
    await groupStore.delete(slug).then(() => history.push(ROUTES.GROUP));
  };

  const DROPDOWN_BUTTONS = [
    {
      label: 'Manage Members',
      handler: () => handleToggle({ manageMembersModal: !toggle.manageMembersModal }),
      'data-cy': 'manage_members',
    },
    {
      label: 'Manage Group',
      handler: () => handleToggle({ createGroupModal: !toggle.createGroupModal }),
      'data-cy': 'manage_group',
    },
    {
      label: 'Delete Group',
      handler: () => handleToggle({ deleteGroupModal: !toggle.deleteGroupModal }),
      'data-cy': 'delete_group',
    },
  ];

  return (
    <>
      <main className="container wrapper lg:flex">
        <DashboardSectionList isAdmin className="hidden lg:block" />
        <div className="flex-grow">
          <Breadcrumb
            between={{
              title: `Groups`,
              link: `${ROUTES.GROUP}`,
            }}
            title={data?.item.name}
            link={`${match.url}/${data?.item.name}`}
            className="mb-8"
          />
          <MobileMenu isAdmin title={data.item.name}>
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
              <i className="ml-auto material-icons btn-action" data-cy="group_details_dropdown">
                more_vert
              </i>
            </Dropdown>
          </MobileMenu>
          {/* <input
            className="flex w-full mt-6 input-search"
            type="text"
            placeholder="Search"
            onChange={handleGlobalSearch}
          /> */}
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <MobileDropdownButton
                title={TABS.find((i) => i.value === selectedTab).label}
                isOpen={toggle.mobileMenu}
                onToggle={() => handleToggle({ mobileMenu: !toggle.mobileMenu })}
              />
              <div
                className={cx('p-4 lg:p-0 mb-8 bg-gray-50 lg:bg-transparent lg:block', { hidden: !toggle.mobileMenu })}
              >
                <div className="flex mb-4 lg:hidden">
                  <button onClick={() => handleToggle({ mobileMenu: false })} className="ml-auto material-icons">
                    close
                  </button>
                </div>
                <Tabs tabs={TABS} current={selectedTab} onClick={setSelectedTab} />
              </div>
              {selectedTab === 'members' && <Members data={data.item.users} />}
              {selectedTab === 'activity' && <Activity id={data.item._id} />}
              {selectedTab === 'permissions' && <Permissions id={data.item._id} />}
            </>
          )}
        </div>
      </main>
      {toggle.manageMembersModal && (
        <ManageMembers
          data={data.item.users}
          onSuccess={getData}
          onToggle={(show) => {
            handleToggle({ manageMembersModal: show || !toggle.manageMembersModal });
          }}
          isSystem={data.item.isSystem}
        />
      )}
      {toggle.createGroupModal && (
        <GroupModal
          data={data.item}
          onSuccess={getData}
          onToggle={(show) => {
            handleToggle({ createGroupModal: show || !toggle.createGroupModal });
          }}
        />
      )}
      {toggle.deleteGroupModal && (
        <ReminderModal
          onToggle={() => handleToggle({ deleteGroupModal: !toggle.deleteGroupModal })}
          title={`Delete Group ${data.item.name}`}
          message="Are you sure you want to delete?"
          onHandle={handleDelete}
        />
      )}
    </>
  );
};

export default inject(({ groupStore }) => ({ groupStore }))(observer(Groups));
