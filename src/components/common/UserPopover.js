import { dateFormat, timeAgoFormat } from 'utils';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { max, parseISO } from 'date-fns';
import { Preview } from 'components/common/Form/Editor';
import { ROUTES } from 'definitions';
import { usePopper } from 'react-popper';
import cx from 'classnames';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import useClickOutside from 'hooks/useClickOutside';

const UserPopover = ({ userStore, onToggleMessage, placement = 'auto', buttonRef, onClose, user: _user }) => {
  const [user, setUser] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const popperRef = React.useRef(null);
  useClickOutside({ onClose, elemRef: buttonRef });

  const { styles, attributes, update } = usePopper(buttonRef.current, popperRef.current, {
    placement,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 10],
        },
      },
    ],
  });

  React.useEffect(() => {
    update && update();
  }, [placement, buttonRef, update]);

  React.useEffect(() => {
    setIsLoading(true);
    userStore.get(_user).then(({ item }) => {
      setUser(item);
      setIsLoading(false);
    });
  }, [_user, userStore]);

  const readingTime = Math.floor(user.readingTime / 60 / 60 / 24);
  const userAbout = user?.about?.length > 160 ? user.about?.substr(0, 160) : user.about;

  return (
    <>
      <div className={cx('user-popover')} ref={popperRef} style={styles.popper} {...attributes.popper}>
        {isLoading ? (
          <>
            <Skeleton height={30} width={300} />
            <Skeleton />
            <Skeleton />
          </>
        ) : (
          <>
            <div className="flex items-start">
              <div className="flex items-center mb-4">
                {user.avatar && (
                  <Link to={`${ROUTES.PROFILE}/${user?.displayName?.toLowerCase()}`} className="relative">
                    <img className="w-20 h-20 mr-4 rounded-full avatar" alt={user.displayName} src={user.avatar} />
                    {user?.leader && <div className="icon-leader icon-popover"></div>}
                    {user?.star && !user?.leader && <div className="icon-star icon-popover"></div>}
                    {user?.primaryGroup && (
                      <div
                        className="absolute bottom-0 right-0 w-12 h-12 p-2 mr-2 -mb-1 overflow-hidden bg-center rounded-full"
                        style={{ backgroundColor: `#${user?.primaryGroup?.flair_bg_color}` }}
                      >
                        <div
                          className="w-full h-full bg-cover"
                          style={{
                            backgroundImage: `url(${process.env.REACT_APP_API_SERVER}/group/image/${user.primaryGroup.flair_icon?.filename})`,
                            backgroundRepeat: 'no-repeat',
                          }}
                        ></div>
                      </div>
                    )}
                  </Link>
                )}
                <div>
                  {user?.star && !user?.leader && (
                    <div className={cx({ 'popover-role': !user?.avatar, 'popover-role-avatar': user?.avatar })}>
                      Star Member
                    </div>
                  )}
                  {user?.leader && (
                    <div className={cx({ 'popover-role': !user?.avatar, 'popover-role-avatar': user?.avatar })}>
                      Community Leader
                    </div>
                  )}
                  <Link to={`${ROUTES.PROFILE}/${user?.displayName?.toLowerCase()}`} className="hover:text-primary">
                    <h1>{user.displayName}</h1>
                    {user.name}
                  </Link>
                  {userStore?.user && (
                    <button className="block md:hidden btn btn-outline" onClick={onToggleMessage}>
                      Message me
                    </button>
                  )}
                </div>
              </div>
              {userStore?.user && (
                <button className="hidden ml-auto md:block btn btn-outline" onClick={onToggleMessage}>
                  Message me
                </button>
              )}
            </div>
            {userAbout && (
              <div title={userAbout}>
                <Preview data={user.about} />
              </div>
            )}

            <div className="flex">
              {user.lastPostDate && user.lastReplyDate && (
                <>
                  <label>Posted: </label>{' '}
                  {timeAgoFormat(max([parseISO(user.lastPostDate), parseISO(user.lastReplyDate)]))}
                </>
              )}
              <label>Joined: </label> {dateFormat(user.createdAt)}
              {readingTime !== 0 && (
                <>
                  <label>Read: </label> {readingTime}d
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default inject(({ userStore }) => ({ userStore }))(observer(UserPopover));
