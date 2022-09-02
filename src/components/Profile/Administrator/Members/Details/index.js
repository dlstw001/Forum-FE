import { inject, observer } from 'mobx-react';
import { NavLink, Redirect, Route, Switch } from 'react-router-dom';
import { ROUTES } from 'definitions';
import Activity from './Activity';
import Breadcrumb from 'components/common/Breadcrumb';
import DashboardSectionList from '../../../DashboardSectionList';
import Loading from 'components/common/Loading';
// import Message from './Message';
// import MessageDetail from './Message/Detail';
import Preferences from './Preferences';
import React from 'react';
import Summary from './Summary';
import UserAvatar from 'components/Profile/User/Profile/UserAvatar';
import useToggle from 'hooks/useToggle';

const TABS = [
  { value: 'summary', label: 'Summary' },
  { value: 'activity', label: 'Activity' },
  // { value: 'message', label: 'Messages' },
  { value: 'preference', label: 'Preferences' },
];

const Details = ({ userStore, match }) => {
  const { displayName } = match.params;
  const { handleToggle, toggle } = useToggle({ editProfileModal: false });
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  const getData = React.useCallback(async () => {
    await userStore
      .get(displayName)
      .then((data) => setUser(data.item))
      .finally(() => setIsLoading(false));
  }, [displayName, userStore]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  return (
    <main className="container wrapper lg:flex">
      <DashboardSectionList isAdmin className="hidden lg:block" />
      {isLoading && <Loading className="w-full" />}
      {user && (
        <div className="flex-grow">
          <Breadcrumb
            between={{
              title: `Community Members`,
              link: `${ROUTES.USERS}`,
            }}
            title={user.name}
            link={`${match.url}`}
            className="mb-8"
          />
          <div className="lg:flex">
            <div>
              <UserAvatar user={user} />
              {userStore?.isAdmin && (
                <button
                  className="w-full lg:text-xs btn btn-outline"
                  onClick={() => handleToggle({ editProfileModal: !toggle.editProfileModal })}
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="w-full lg:pl-16">
              <ul className="flex-wrap my-8 lg:flex tab-menu">
                {TABS.map((tab) => (
                  <li key={tab.value}>
                    <NavLink to={`${ROUTES.USERS}/${displayName}/${tab.value}`} className="anchor">
                      {tab.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <Switch>
                <Route path={`${ROUTES.USERS}/:displayName/summary`} exact component={() => <Summary user={user} />} />
                <Route path={`${ROUTES.USERS}/:displayName/activity/:section?`} component={Activity} />
                <Route
                  path={`${ROUTES.USERS}/:displayName/preference`}
                  component={() => <Preferences user={user} updateCallback={getData} />}
                />
                {/* <Route path={`${ROUTES.USERS}/:displayName/message/:type?`} exact component={Message} /> */}
                {/* <Route path={`${ROUTES.USERS}/:displayName/message/read/:id`} exact component={MessageDetail} /> */}
                <Redirect from={`${ROUTES.USERS}/:displayName`} to={`${ROUTES.USERS}/:displayName/summary`} />
              </Switch>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default inject(({ userStore }) => ({ userStore }))(observer(Details));
