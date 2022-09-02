import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { ROLES, ROOT_ROUTES, ROUTES } from 'definitions';
import { TourProvider } from 'context/TourContext';
import Backups from 'components/Profile/Administrator/Backups';
import Bookmarks from 'components/Profile/Personal/Bookmarks';
import Callback from 'components/Callback';
import Categories from 'components/Categories';
import CategoryDetails from 'components/Categories/Details';
import Dashboard from 'components/Profile/Administrator/Dashboard';
import Drafts from 'components/Profile/Personal/Drafts';
import Groups from 'components/Profile/Administrator/Groups';
import Home from 'components/Home';
import Logs from 'components/Profile/Administrator/Logs';
import MainLayout from 'components/common/MainLayout';
import Members from 'components/Profile/Administrator/Members';
import Messages from 'components/Profile/Personal/Messages/Home';
import NotFound from 'components/NotFound';
import Notifications from 'components/Notifications';
import Profile from 'components/Profile/User';
import ProtectedRoute from 'components/common/ProtectedRoute';
import React, { Suspense } from 'react';
import Review from 'components/Review';
import Search from 'components/Search';
import Tag from 'components/Tag';
import TopicDetails from 'components/Topics/Details';
import Topics from 'components/Topics';
import useMarkerIo from 'hooks/useMarkerIo';

import { isLocalhost } from 'utils';
import Cases from 'components/Cases';
import Details from 'components/Profile/Personal/Messages/Details';
import Maintenance from 'components/Maintenance';
import useGoogleAnalytics from 'hooks/useGoogleAnalytics';
// TODO: Rearrange the paths.
const App = () => {
  useMarkerIo({
    enabled: !isLocalhost,
  });

  useGoogleAnalytics(!isLocalhost && process.env.REACT_APP_GA);

  return (
    <TourProvider>
      <Suspense>
        <BrowserRouter>
          <Switch>
            <ProtectedRoute component={() => <MainLayout component={Notifications} />} path={ROUTES.NOTIFICATIONS} />
            <ProtectedRoute component={() => <MainLayout component={Drafts} />} path={ROUTES.DRAFT} />
            <ProtectedRoute
              path={`${ROUTES.MESSAGES}/:id/:replyNo?`}
              component={() => <MainLayout component={Details} />}
            />
            <ProtectedRoute path={ROUTES.MESSAGES} component={() => <MainLayout component={Messages} />} />
            <ProtectedRoute
              allowed={[ROLES.ADMIN]}
              component={() => <MainLayout component={Dashboard} />}
              path={ROUTES.DASHBOARD}
            />
            <ProtectedRoute component={() => <MainLayout component={Bookmarks} />} path={ROUTES.BOOKMARKS} />
            <ProtectedRoute
              allowed={[ROLES.ADMIN]}
              component={() => <MainLayout component={Groups} />}
              path={ROUTES.GROUP}
            />
            <ProtectedRoute
              allowed={[ROLES.ADMIN]}
              component={() => <MainLayout component={Members} />}
              path={ROUTES.USERS}
            />
            <ProtectedRoute
              allowed={[ROLES.ADMIN]}
              component={() => <MainLayout component={Logs} />}
              path={ROUTES.LOGS}
            />
            <ProtectedRoute
              allowed={[ROLES.ADMIN]}
              component={() => <MainLayout component={Backups} />}
              path={ROUTES.BACKUPS}
            />
            <ProtectedRoute
              allowed={[ROLES.ADMIN, ROLES.MODERATOR]}
              component={() => <MainLayout component={Review} />}
              path={ROUTES.REVIEW}
            />
            <Route path={ROUTES.CALLBACK} component={Callback} />
            <Route path={ROUTES.PROFILE} component={Profile} />
            <MainLayout path={ROUTES.TAG} component={Tag} />
            {/* <MainLayout path={ROUTES.CUSTOMER_CASE} component={CustomerCase} /> */}
            <MainLayout path={ROUTES.NOT_FOUND} component={NotFound} />
            <Route path={ROUTES.NETWORK_ERROR} component={Maintenance} />
            <MainLayout path={`${ROUTES.TOPIC}/:slug/:id?/:replyNo?`} component={TopicDetails} />
            <MainLayout path={ROUTES.SEARCH} component={Search} />

            <MainLayout path={ROUTES.TOPIC} component={Topics} />
            <MainLayout path={`${ROUTES.CATEGORY_DETAILS}/:parent/:id`} component={CategoryDetails} />
            <MainLayout path={`${ROUTES.CATEGORY_DETAILS}/:id`} component={CategoryDetails} />
            <MainLayout path={ROUTES.CATEGORIES} component={Categories} />
            <MainLayout path={ROOT_ROUTES.CASE} component={Cases} />
            <Redirect from={ROUTES.CATEGORY_DETAILS} to={ROUTES.CATEGORIES} />
            <Redirect from={`${ROUTES.TAG}/:name`} to={`${ROUTES.TOPIC}?tab=findByTag&tag=:name`} />
            <Redirect from={`${ROUTES.TOPIC_ALIAS}/:slug/:id?/:replyNo`} to={`${ROUTES.TOPIC}/:slug/:id?/:replyNo`} />

            <MainLayout path="/" component={Home} />
          </Switch>
        </BrowserRouter>
      </Suspense>
    </TourProvider>
  );
};

export default inject(({ userStore }) => ({ userStore }))(observer(App));
