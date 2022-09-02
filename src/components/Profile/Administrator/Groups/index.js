import { Route, Switch } from 'react-router-dom';
import { ROUTES } from 'definitions';
import Detail from './Details';
import Home from './Home';
import React from 'react';

const Group = () => (
  <Switch>
    <Route path={`${ROUTES.GROUP}/:slug`} component={Detail} />
    <Route path={ROUTES.GROUP} component={Home} />
  </Switch>
);

export default Group;
