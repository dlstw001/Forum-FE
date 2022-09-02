import { ROUTES } from 'definitions';
import { Switch } from 'react-router-dom';
import Activity from './Activity';
import Home from './Profile';
import MainLayout from 'components/common/MainLayout';
import ProtectedRoute from 'components/common/ProtectedRoute';
import React from 'react';
import Settings from './Settings';

export default () => (
  <Switch>
    <ProtectedRoute
      component={() => <MainLayout component={Settings} />}
      path={`${ROUTES.PROFILE}/:displayName${ROUTES.SETTINGS}`}
    />
    <MainLayout path={`${ROUTES.PROFILE}/:displayName${ROUTES.ACTIVITY}`} component={Activity} />
    <MainLayout path={`${ROUTES.PROFILE}/:displayName`} component={Home} />
  </Switch>
);
