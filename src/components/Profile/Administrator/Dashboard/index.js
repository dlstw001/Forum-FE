import ActivityMetrics from './ActivityMetrics';
import Breadcrumb from 'components/common/Breadcrumb';
import ConsolidatedPageViews from './ConsolidatedPageViews';
import DashboardSectionList from '../../DashboardSectionList';
import MobileMenu from 'components/Profile/MobileMenu';
import React from 'react';
import TopReferredTopics from './TopReferredTopics';
import TopUserActivity from './TopUserActivity';
import TrendingSearchTerms from './TrendingSearchTerms';
import UsersInfo from './UsersInfo';

export default () => {
  return (
    <>
      <main className="container wrapper lg:flex">
        <DashboardSectionList isAdmin={true} className="hidden lg:block" />
        <div className="flex flex-col w-full">
          <Breadcrumb title={`Dashboard`} className="mb-8" />
          <MobileMenu isAdmin={true} title="Dashboard" />
          <ConsolidatedPageViews />
          <UsersInfo />
          <ActivityMetrics />
          <TopReferredTopics />
          <TrendingSearchTerms />
          <TopUserActivity />
        </div>
      </main>
    </>
  );
};
