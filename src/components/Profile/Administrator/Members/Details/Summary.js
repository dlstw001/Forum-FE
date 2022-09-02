import MostSection from 'components/Profile/User/Profile/MostSection';
import React from 'react';
import RecentDevices from 'components/Profile/User/Profile/RecentDevices';
import TopCategories from 'components/Profile/User/Profile/TopCategories';
import TopSection from 'components/Profile/User/Profile/TopSection';
import UserStatistics from 'components/Profile/User/Profile/UserStatistics';

export default ({ user }) => {
  return (
    <>
      <UserStatistics user={user} />
      <TopSection user={user} />
      <MostSection user={user} />
      {user.recentDevices.length !== 0 && <RecentDevices user={user} />}
      {user.topCategory.length !== 0 && <TopCategories user={user} />}
    </>
  );
};
