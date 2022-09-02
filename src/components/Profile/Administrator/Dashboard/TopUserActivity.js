import { inject, observer } from 'mobx-react';
import React from 'react';
import Tooltip from 'components/common/Tooltip';
import UserActivityModal from 'components/common/modals/UserActivityModal';
import useToggle from 'hooks/useToggle';

const TopUserActivity = ({ dashboardStore }) => {
  const [userStats, setUserStats] = React.useState([]);

  const getTopUserActivity = React.useCallback(async () => {
    const users = await dashboardStore.getTopUserActivity();
    setUserStats(users);
  }, [dashboardStore]);

  React.useEffect(() => {
    getTopUserActivity();
  }, [getTopUserActivity]);

  return (
    <section>
      <h3 className="items-center justify-center report-title">
        TOP USERS
        <Tooltip placement="bottom" trigger="hover" tooltip="Top 50 users activity statistics">
          <i className="forum-helper material-icons md-18">help</i>
        </Tooltip>
      </h3>
      <div className="top-users-container">
        {userStats.length > 0 &&
          userStats.map((stats, index) => <Activity key={index} activityName={Object.keys(stats)[0]} stats={stats} />)}
      </div>
    </section>
  );
};

// Create a component for different user activities
const Activity = ({ activityName, stats }) => {
  const name = (activityName.charAt(0).toUpperCase() + activityName.substr(1)).split(/(?=[A-Z])/).join(' ');
  const { handleToggle, toggle } = useToggle({ [activityName]: false });

  return (
    <>
      <div className="top-users-item" onClick={() => handleToggle({ [activityName]: !toggle[activityName] })}>
        {name}
      </div>
      {toggle[activityName] && (
        <UserActivityModal
          activityName={activityName}
          data={stats}
          onToggle={() => handleToggle({ [activityName]: !toggle[activityName] })}
        />
      )}
    </>
  );
};

export default inject(({ dashboardStore }) => ({ dashboardStore }))(observer(TopUserActivity));
