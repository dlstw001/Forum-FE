import { inject, observer } from 'mobx-react';
import { Preview } from 'components/common/Form/Editor';
import Breadcrumb from 'components/common/Breadcrumb';
import DashboardSectionList from 'components/Profile/DashboardSectionList';
import Dropdown from 'components/common/Dropdown';
import DropdownMenu from 'components/common/DropdownMenu';
import EditProfileModal from 'components/common/modals/ProfileModal';
import MobileMenu from 'components/Profile/MobileMenu';
import MostSection from 'components/Profile/User/Profile/MostSection';
import React from 'react';
import RecentDevices from './RecentDevices';
import Skeleton from 'react-loading-skeleton';
import TopCategories from './TopCategories';
import TopSection from 'components/Profile/User/Profile/TopSection';
import UserAvatar from './UserAvatar';
import UserStatistics from 'components/Profile/User/Profile/UserStatistics';
import UserSummary from './UserSummary';
import useToggle from 'hooks/useToggle';

const Profile = ({ match, userStore }) => {
  const { displayName } = match.params;
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState();
  const { handleToggle, toggle } = useToggle({ editProfileModal: false });

  const getData = React.useCallback(async () => {
    await userStore
      .get(displayName)
      .then((data) => setUser(data.item))
      .finally(() => setIsLoading(false));
  }, [displayName, userStore]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  const DROPDOWN_BUTTONS = [
    {
      label: 'edit profile',
      handler: () => handleToggle({ editProfileModal: !toggle.editProfileModal }),
      'data-cy': 'edit_profile_btn',
    },
  ];

  return (
    <main className="container wrapper lg:flex">
      <DashboardSectionList displayName={displayName} className="hidden lg:block" />
      <div className="flex-grow">
        <Breadcrumb title={`Profile`} className="mb-8" />
        <MobileMenu displayName={displayName} title="Profile">
          {(userStore.user?.admin || userStore.user?.displayName.toLowerCase() === displayName) && (
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
              <i className="ml-auto material-icons btn-action" data-cy="user_profile_dropdown">
                more_vert
              </i>
            </Dropdown>
          )}
        </MobileMenu>
        <div className="lg:flex">
          <UserAvatar user={user} isLoading={isLoading} />
          <div className="w-full lg:pl-16">
            {isLoading && (
              <>
                <Skeleton count={5} />
                <div className="flex flex-col mb-4">
                  <Skeleton width={'70%'} />
                  <Skeleton width={'90%'} />
                  <Skeleton width={'30%'} />
                  <Skeleton width={'50%'} />
                </div>
                <Skeleton count={7} />
              </>
            )}
            {!isLoading && (
              <>
                {user?.about && <Preview data={user.about} />}
                <UserSummary user={user} />
                <UserStatistics user={user} />
                <TopSection user={user} />
                <MostSection user={user} />
                {user?.recentDevices.length !== 0 && <RecentDevices user={user} />}
                {user?.topCategory.length !== 0 && <TopCategories user={user} />}
              </>
            )}
          </div>
        </div>
      </div>
      {toggle.editProfileModal && (
        <EditProfileModal
          data={user}
          onToggle={(show) => handleToggle({ editProfileModal: show || !toggle.editProfileModal })}
          update={getData}
        />
      )}
    </main>
  );
};

export default inject(({ userStore }) => ({ userStore }))(observer(Profile));
