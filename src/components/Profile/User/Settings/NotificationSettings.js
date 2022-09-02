import React from 'react';
import Skeleton from 'react-loading-skeleton';
import ToogleSwitch from 'components/common/ToggleSwitch';

export default ({ user, isLoading, notificationSetList, setNotificationSetList }) => {
  React.useEffect(() => {
    if (user) {
      setNotificationSetList([
        // {
        //   name: 'New Topics',
        //   email: user.notifications.newTopic.email,
        //   web: user.notifications.newTopic.web,
        //   _id: '1',
        //   help: 'help',
        //   'data-cy': 'newTopic',
        // },
        {
          name: 'Messages',
          email: user.notifications.messages.email,
          web: user.notifications.messages.web,
          _id: '2',
          help: 'help',
          'data-cy': 'messages',
        },
        {
          name: 'Mentions',
          email: user.notifications.mentions.email,
          web: user.notifications.mentions.web,
          _id: '3',
          help: 'help',
          'data-cy': 'mentions',
        },
        {
          name: 'Likes',
          email: user.notifications.likes.email,
          web: user.notifications.likes.web,
          _id: '4',
          help: 'help',
          'data-cy': 'likes',
        },
      ]);
    }
  }, [setNotificationSetList, user]);

  const handleToogle = (item, type, value) => {
    const newList = notificationSetList.map((i) => {
      if (i === item) {
        const updatedItem = {
          ...i,
          [type]: value,
        };
        return updatedItem;
      }
      return i;
    });
    setNotificationSetList(newList);
  };

  const PermissionSection = ({ item }) => {
    return (
      <>
        <span className="mb-2 notification-title">
          {item.name} {/*<i className="forum-helper material-icons md-18">help</i>*/}
        </span>
        <div className="flex ml-auto">
          <div className="mr-8">
            <ToogleSwitch
              id={item.name + 'web'}
              name="web"
              checked={item.web}
              onChange={(value) => handleToogle(item, 'web', value)}
              data-cy={`${item['data-cy']}_web`}
            />
          </div>
          <div>
            <ToogleSwitch
              id={item.name + 'email'}
              name="email"
              checked={item.email}
              onChange={(value) => handleToogle(item, 'email', value)}
              data-cy={`${item['data-cy']}_email`}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="mb-8">
      <h4 className="mb-2 summary-subtitle">Notifications</h4>
      {isLoading && <Skeleton count={4} className="mb-2" />}
      {!isLoading && (
        <div className="grid grid-cols-2">
          <div />
          <div className="flex ml-auto">
            <p className="mr-8">Live</p>
            <p>Email</p>
          </div>
          {notificationSetList.map((item, index) => (
            <PermissionSection item={item} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};
