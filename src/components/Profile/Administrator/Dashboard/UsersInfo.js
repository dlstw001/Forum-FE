import { inject, observer } from 'mobx-react';
import React from 'react';
import Tooltip from 'components/common/Tooltip';

const UsersPerType = ({ item }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="text-center grid grid-rows-2">
        <h1>{item.admin}</h1>
        <p>Admin</p>
      </div>
      <div className="text-center grid grid-rows-2">
        <h1>{item.moderator}</h1>
        <p>Moderator</p>
      </div>
      <div className="text-center grid grid-rows-2">
        <h1>{item.silenced}</h1>
        <p>Silenced</p>
      </div>
      <div className="text-center grid grid-rows-2">
        <h1>{item.suspended}</h1>
        <p>Suspended</p>
      </div>
    </div>
  );
};

const UsersPerTrustLvl = ({ item }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="text-center grid grid-rows-2">
        <h1>{item.lv_0}</h1>
        <p>New Users</p>
      </div>
      <div className="text-center grid grid-rows-2">
        <h1>{item.lv_1}</h1>
        <p>Basic Users</p>
      </div>
      <div className="text-center grid grid-rows-2">
        <h1>{item.lv_2}</h1>
        <p>Member</p>
      </div>
      <div className="text-center grid grid-rows-2">
        <h1>{item.lv_3}</h1>
        <p>Regular</p>
      </div>
    </div>
  );
};

const UsersInfo = ({ dashboardStore }) => {
  const [userTrustLvl, setUserTrustLvl] = React.useState([]);

  const getTrustLvl = React.useCallback(async () => {
    dashboardStore.getTrustLvl().then((res) => {
      setUserTrustLvl(res);
    });
  }, [dashboardStore]);

  React.useEffect(() => {
    getTrustLvl();
  }, [getTrustLvl]);

  return (
    <div className="mb-12 grid md:grid-cols-2 grid-cols-1 gap-8">
      <div id="users-per-type">
        <h3 className="items-center justify-center report-title">
          Users Per Type&nbsp;
          <Tooltip
            placement="bottom"
            trigger="hover"
            tooltip={
              <>
                Number of users grouped by admin, moderator,
                <br /> suspended, and silenced.
              </>
            }
          >
            <i className="forum-helper material-icons md-18">help</i>
          </Tooltip>
        </h3>
        {userTrustLvl.type && <UsersPerType item={userTrustLvl.type.data} />}
      </div>
      <div id="users-per-trust">
        <h3 className="report-title">
          Users Per Trust Level&nbsp;
          <Tooltip placement="bottom" trigger="hover" tooltip="Number of users grouped by trust level.">
            <i className="ml-1 forum-helper material-icons md-18">help</i>
          </Tooltip>
        </h3>
        {userTrustLvl.trustLevel && <UsersPerTrustLvl item={userTrustLvl.trustLevel.data} />}
      </div>
    </div>
  );
};

export default inject(({ dashboardStore }) => ({ dashboardStore }))(observer(UsersInfo));
