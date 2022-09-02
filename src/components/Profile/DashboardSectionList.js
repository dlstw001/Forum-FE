import { inject, observer } from 'mobx-react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from 'definitions';
import cx from 'classnames';
import React from 'react';

const DashboardSectionList = ({ className, userStore, isAdmin, isPersonal, displayName }) => {
  const AdministratorSection = [
    {
      name: 'Dashboard',
      id: 1,
      link: ROUTES.DASHBOARD,
      icon: 'analytics',
      'data-cy': 'user_admin_dashboard',
    },
    {
      name: 'Groups',
      id: 2,
      link: ROUTES.GROUP,
      icon: 'supervised_user_circle',
      'data-cy': 'user_admin_groups',
    },
    {
      name: 'Community Members',
      id: 3,
      link: ROUTES.USERS,
      icon: 'supervised_user_circle',
      'data-cy': 'user_admin_members',
    },
    {
      name: 'Logs',
      id: 4,
      link: ROUTES.LOGS,
      icon: 'report',
      'data-cy': 'user_admin_logs',
    },
    {
      name: 'Backups',
      id: 5,
      link: ROUTES.BACKUPS,
      icon: 'backup',
      'data-cy': 'user_admin_backups',
    },
  ];

  const UserPreferenceSection = [
    {
      name: 'Profile',
      id: 1,
      link: `${ROUTES.PROFILE}/${displayName && displayName.toLowerCase()}`,
      icon: 'account_circle',
    },
    {
      name: 'Activity',
      id: 2,
      link: `${ROUTES.PROFILE}/${displayName && displayName.toLowerCase()}${ROUTES.ACTIVITY}`,
      icon: 'schedule',
      'data-cy': 'user_profile_activity',
    },
    {
      name: 'Settings',
      id: 6,
      link: `${ROUTES.PROFILE}/${displayName && displayName.toLowerCase()}${ROUTES.SETTINGS}`,
      icon: 'settings',
    },
  ];

  const UserPreferenceSectionGuest = [
    {
      name: 'Profile',
      id: 1,
      link: `${ROUTES.PROFILE}/${displayName && displayName.toLowerCase()}`,
      icon: 'account_circle',
    },
    // {
    //   name: 'Activity',
    //   id: 2,
    //   link: `${ROUTES.PROFILE}/${displayName && displayName.toLowerCase()}${ROUTES.ACTIVITY}`,
    //   icon: 'schedule',
    //   'data-cy': 'user_profile_activity',
    // },
  ];

  const PersonalSectionMe = [
    {
      name: 'Bookmarks',
      id: 1,
      link: `${ROUTES.BOOKMARKS}`,
      icon: 'bookmark',
      'data-key': 'view_bookmarks',
      'data-cy': 'user_profile_bookmarks',
    },
    {
      name: 'Drafts',
      id: 2,
      link: `${ROUTES.DRAFT}`,
      icon: 'drafts',
      'data-key': 'view_drafts',
      'data-cy': 'user_profile_drafts',
    },
    {
      name: 'Private Messages',
      id: 3,
      link: `${ROUTES.MESSAGES}`,
      icon: 'email',
      'data-key': 'view_messages',
      'data-cy': 'user_profile_messages',
    },
  ];

  const DashboardSectionItem = ({ data, exactPath }) => {
    return (
      <NavLink
        className="block px-4 py-2 mb-2 uppercase lg:p-0 lg:normal-case"
        exact={exactPath ? true : false}
        activeClassName="text-primary-dark"
        to={data.link || '/'}
        data-key={data['data-key']}
        data-cy={data['data-cy']}
      >
        <i className="items-center mr-3 material-icons md-20">{data.icon ? data.icon : 'lock'}</i>
        {data.name}
      </NavLink>
    );
  };

  return (
    <div className={cx('pr-4 sidebar', className)}>
      {isAdmin && (
        <>
          <h3 className="hidden sidebar-title lg:block">Administrator</h3>
          <div className="lg:mb-8">
            {AdministratorSection.map((i) => (
              <DashboardSectionItem key={i.id} data={i} exactPath={false} />
            ))}
          </div>
        </>
      )}
      {isPersonal && (
        <>
          <h3 className="hidden sidebar-title lg:block">Personal</h3>
          <div className="font-medium lg:mb-8">
            {PersonalSectionMe.map((i) => (
              <DashboardSectionItem key={i.id} data={i} exactPath={i.name === 'Messages' ? false : true} />
            ))}
          </div>
        </>
      )}
      {!isAdmin && !isPersonal && (
        <>
          <h3 className="hidden sidebar-title lg:block">User Preferences</h3>
          <div className="font-medium lg:mb-8">
            {userStore?.user?.displayName.toLowerCase() === displayName || userStore?.user?.admin
              ? UserPreferenceSection.map((i) => <DashboardSectionItem key={i.id} data={i} exactPath={true} />)
              : UserPreferenceSectionGuest.map((i) => <DashboardSectionItem key={i.id} data={i} exactPath={true} />)}
          </div>
        </>
      )}
    </div>
  );
};

export default inject(({ userStore }) => ({ userStore }))(observer(DashboardSectionList));
