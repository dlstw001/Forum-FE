import cx from 'classnames';
import React from 'react';

export default ({ user, size, children, className, containerClassName, onClick }) => {
  const avatarSize = size === 'xl' ? 48 : size === 'lg' ? 16 : size === 'md' ? 12 : size === 'sm' ? 10 : 8;
  const badgeSize = size === 'xl' ? 24 : size === 'lg' ? 10 : size === 'md' ? 8 : size === 'sm' ? 6 : 5;
  const roleSize = size === 'xl' ? 20 : size === 'lg' ? 8 : size === 'md' ? 6 : size === 'sm' ? 5 : 4;
  const badgePadding = size === 'xl' ? 3 : 1;

  return (
    <>
      <div className={cx('flex items-center flex-shrink-0', { 'cursor-pointer': onClick }, containerClassName)}>
        <div
          className={cx('rounded-full relative', className, `image-${size}`, `w-${avatarSize} h-${avatarSize}`)}
          onClick={onClick}
        >
          {user?.leader && <div className={`absolute icon-leader z-10 icon-role w-${roleSize} h-${roleSize}`}></div>}
          {user?.star && !user?.leader && (
            <div className={`absolute icon-star z-10 icon-role w-${roleSize} h-${roleSize}`}></div>
          )}
          <div className={`overflow-hidden relative rounded-full w-${avatarSize} h-${avatarSize}`}>
            <img
              referrerPolicy="no-referrer"
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${(user?.name || user?.displayName)?.replace(/\s/g, '+')}`
              }
              alt="..."
              className="avatar-img"
            />
          </div>
          {user?.primaryGroup && user?.primaryGroup?.flair_icon?.filename && (
            <div
              className={cx(
                `absolute bottom-0 right-0 -mb-2 -mr-2 p-${badgePadding} bg-center rounded-full overflow-hidden w-${badgeSize} h-${badgeSize}`
              )}
              style={{ backgroundColor: `#${user?.primaryGroup?.flair_bg_color}` }}
            >
              <div
                className="w-full h-full bg-cover"
                style={{
                  backgroundImage: `url(${process.env.REACT_APP_API_SERVER}/group/image/${user.primaryGroup.flair_icon.filename})`,
                  backgroundRepeat: 'no-repeat',
                }}
              ></div>
            </div>
          )}
        </div>
        {children}
      </div>
    </>
  );
};
