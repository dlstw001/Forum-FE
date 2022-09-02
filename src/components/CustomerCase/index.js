import { Route, Switch } from 'react-router-dom';
import Detail from './Detail';
import Home from './Home';
import React from 'react';

export default () => {
  return (
    <Switch>
      <Route path="/:root/:id" component={Detail} />
      <Route path="/:root" component={Home} />
    </Switch>
  );
};
