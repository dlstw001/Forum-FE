import { Route, Switch } from 'react-router-dom';
import { ROUTES } from 'definitions';
import Detail from './Details/index';
import Home from './Home';
import React from 'react';

const Members = () => (
  <Switch>
    <Route path={`${ROUTES.USERS}/:displayName`} component={Detail} />
    <Route path={ROUTES.USERS} component={Home} />
  </Switch>
);

export default Members;
