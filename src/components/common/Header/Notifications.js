import { difference } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { notificationType } from 'utils';
import { ROUTES } from 'definitions';
import { withRouter } from 'react-router-dom';
import Dropdown from '../Dropdown';
import React from 'react';

const Notifications = ({ notificationStore }) => {
  const [items, setItems] = React.useState();
  const [count, setCount] = React.useState(0);

  const getNotifications = React.useCallback(async () => {
    const payload = {
      page: 1,
      limit: 5,
      sort_by: 'createdAt',
      order_by: 'desc',
      isRead: false,
    };

    await notificationStore.find(payload).then((res) => {
      setItems(res.data);
      setCount(res.total);
    });
  }, [notificationStore]);

  const onRead = async (i, clearInstantly = true) => {
    let arr = [];
    arr.push(i._id);

    const payload = {
      ids: arr,
    };

    await notificationStore.read(payload).then((res) => {
      if (res?.statusCode === 202 && clearInstantly) {
        setCount((prevState) => prevState - 1);
        setItems((prevState) => difference(prevState, [i]));
      }
    });
  };

  const getNotificationCount = React.useCallback(async () => {
    await notificationStore.getNumber({}, true).then((res) => {
      setCount(res.total);
    });
  }, [notificationStore]);

  React.useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      getNotificationCount();
    }, 10000);

    return () => clearInterval(interval);
  }, [getNotificationCount]);

  return (
    <Dropdown
      placement="bottom-end"
      menuClassname="notifications"
      className="flex items-center h-full ml-3"
      menu={({ style }) => (
        <div className="notifications-list-menu" style={style}>
          <div className="flex flex-row items-end mb-4">
            <div className="heading">Notifications</div>
            <Link className="ml-auto" to={`${ROUTES.NOTIFICATIONS}`}>
              <h6 className="view-all" data-cy="notifications_view_all">
                View All
              </h6>
            </Link>
          </div>
          {items && items.length > 0 ? (
            <ul className="list-none notifications-list">
              {items.map((i, key) => (
                <li key={key}>
                  <Link
                    to={notificationType(i).link}
                    className="flex"
                    onClick={() => onRead(i)}
                    onContextMenu={() => onRead(i, false)}
                  >
                    <i className="icon-bg material-icons">{i.type === 'post' ? 'mark_email_unread' : 'person'}</i>
                    <span className="text-sm text-left">
                      <div className="message">{notificationType(i).message}</div>
                      <div className="post-date">{notificationType(i).createdAt}</div>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <p className="flex items-center">You have no notifications</p>
            </div>
          )}
        </div>
      )}
    >
      <div className="relative">
        <button className="text-white material-icons md-32" data-cy="user_notifications" onClick={getNotifications}>
          notifications
        </button>
        {count > 0 && <small className="count">{count}</small>}
      </div>
    </Dropdown>
  );
};

export default inject(({ notificationStore }) => ({ notificationStore }))(withRouter(observer(Notifications)));
