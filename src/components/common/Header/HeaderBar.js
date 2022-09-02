import { inject, observer } from 'mobx-react';
import { isNull } from 'lodash';
import { LOGIN_URL } from 'definitions';
import Hamburger from './Hamburger';
import Notifications from './Notifications';
import React from 'react';
import UserAvatar from './UserAvatar';

const HeaderBar = ({ user, userStore, authStore }) => {
  const updateUserData = React.useCallback(async () => {
    if (localStorage.getItem(process.env.REACT_APP_APP_NAME)) {
      const { suspended_till } = await userStore.me(true);

      if (!isNull(suspended_till)) {
        window.alert('You account is suspended. You will be redirected back to homepage.');
        authStore.logout();
      }
    }
  }, [authStore, userStore]);

  React.useEffect(() => {
    updateUserData();
  }, [updateUserData]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      updateUserData();
    }, 60000);

    return () => clearInterval(interval);
  }, [updateUserData]);

  return (
    <div className="flex items-center">
      {user ? (
        <>
          <Notifications user={user} />
          <UserAvatar user={user} />
        </>
      ) : (
        <button
          className="flex items-center ml-4 icon-login material-icons material-icons-outlined md-30"
          onClick={() => (window.location.href = LOGIN_URL)}
        >
          person
        </button>
      )}
      <Hamburger />
    </div>
  );
};

export default inject(({ userStore, authStore }) => ({ userStore, authStore }))(observer(HeaderBar));
