import { dateFormat } from 'utils';
import { TRUSTLVL } from 'definitions';
import ct from 'countries-and-timezones';
import React from 'react';

export default ({ user = {} }) => {
  const [timezones, setTimezones] = React.useState({ data: [] });

  React.useEffect(() => {
    setTimezones({ data: Object.values(ct.getAllTimezones()) });
  }, []);

  return (
    <>
      <div className="flex items-center mb-12">
        {user.location && (
          <div className="mr-4">
            <i className="mr-2 material-icons md-20 text-primary">location_on</i>
            <span>{user.location}</span>
          </div>
        )}
        {user.website && (
          <div className="mr-4">
            <i className="mr-2 material-icons md-20 text-primary">language</i>
            <a href={user.website} className="underline">
              {user.website}
            </a>
          </div>
        )}
        {user.timezone && (
          <div>
            <i className="mr-2 material-icons md-20 text-primary">schedule</i>
            <span>{`${user.timezone} ${timezones?.data.find((i) => i.name === user?.timezone)?.utcOffsetStr}UTC`}</span>
          </div>
        )}
      </div>
      <div className="items-start mb-4 grid md:flex gap-2 md:grid-flow-col grid-cols-6">
        <div>
          <div className="profile-activity md:mr-2 md:inline-block">Joined</div>
          {dateFormat(user.createdAt)}
        </div>
        <span className="hidden md:mx-2 md:block">|</span>
        <div>
          <div className="profile-activity md:mr-2 md:inline-block">Last Post</div>
          {dateFormat(user.lastPostDate)}
        </div>
        <span className="hidden md:mx-2 md:block">|</span>
        <div>
          <div className="profile-activity md:mr-2 md:inline-block">Last Seen</div>
          {dateFormat(user.lastSeen)}
        </div>
        {user.lastIP && (
          <>
            <span className="hidden md:mx-2 md:block">|</span>
            <div>
              <div className="profile-activity md:mr-2 md:inline-block">Last IP</div>
              {user.lastIP}
            </div>
          </>
        )}
        <span className="hidden md:mx-2 md:block">|</span>
        <div>
          <div className="profile-activity md:mr-2 md:inline-block">Views</div>
          {user.postViews}
        </div>
        <div className="md:ml-auto md:pl-4">
          <div className="profile-activity md:mr-2 md:inline-block">Trust Level:</div>
          {TRUSTLVL[user?.trustLevel || 0].name}
        </div>
      </div>
    </>
  );
};
