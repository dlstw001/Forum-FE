import { Route, Switch } from 'react-router-dom';
import { ROUTES } from 'definitions';
// import ChildSection from './ChildSection';
import Home from './Home';
import React from 'react';

const Categories = () => (
  <Switch>
    {/* <Route path={`${ROUTES.CATEGORIES}/:id`} component={ChildSection} /> */}
    <Route path={ROUTES.CATEGORIES} component={Home} />
  </Switch>
);

export default Categories;
