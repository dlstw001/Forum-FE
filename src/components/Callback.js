import { inject, observer } from 'mobx-react';
import { isNull } from 'lodash';
import Loading from './common/Loading';
import qs from 'query-string';
import React from 'react';

const Callback = ({ history, userStore, authStore }) => {
  const callBack = React.useCallback(async () => {
    const res = qs.parse(history.location.search);
    localStorage.setItem(process.env.REACT_APP_APP_NAME, JSON.stringify(res));

    const { suspended_till } = await userStore.me();

    if (!isNull(suspended_till)) {
      window.alert('You account is suspended. You will be redirected back to homepage.');
      authStore.logout();
    }

    window.location.href = '/';
  }, [authStore, history.location.search, userStore]);

  React.useEffect(() => {
    callBack();
  }, [callBack]);

  return <Loading />;
};

export default inject(({ userStore, authStore }) => ({ userStore, authStore }))(observer(Callback));
