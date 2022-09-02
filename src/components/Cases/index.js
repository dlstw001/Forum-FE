import { Route, Switch } from 'react-router-dom';
import Detail from './Details';
import Home from './Home';
import React from 'react';

export default () => {
  return (
    <Switch>
      <Route path="/:root/:slug/:replyNo?" component={Detail} />
      <Route path="/:root" component={Home} />
    </Switch>
  );
};
