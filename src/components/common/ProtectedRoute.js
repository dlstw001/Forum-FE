import { inject, observer } from 'mobx-react';
import { Redirect, Route } from 'react-router-dom';
import { ROLES, ROUTES } from 'definitions';
import React from 'react';

export default inject(({ userStore }) => ({ userStore }))(
  observer(({ userStore, allowed = [], component: Component, ...rest }) => {
    const isAuthenticated = localStorage.getItem(process.env.REACT_APP_APP_NAME);
    const condition =
      allowed.length === 0 ||
      allowed.find(
        (i) => (i === ROLES.ADMIN && userStore.user?.admin) || (i === ROLES.MODERATOR && userStore.user?.moderator)
      );

    if (isAuthenticated) {
      if (userStore.user) {
        if (condition) return <Route {...rest} render={(props) => <Component {...props} />} />;
        else return <Redirect to={ROUTES.NOT_FOUND} />;
      } else {
        return <Route {...rest} render={(props) => <Component {...props} />} />;
      }
    } else {
      return <Redirect to={ROUTES.NOT_FOUND} />;
    }
  })
);

// function ProtectedRoute({ component: Component, ...restOfProps }) {
//   // const isAuthenticated = localStorage.getItem('isAuthenticated');
//   // console.log('this', isAuthenticated);

//   return <Route {...restOfProps} render={(props) => <Component {...props} />} />;
// }

// export default ProtectedRoute;
