import { inject, observer } from 'mobx-react';
import CreateMessageModal from 'components/common/modals/CreateMessageModal';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import UserItem from 'components/common/UserItem';
import useToggle from 'hooks/useToggle';

const UserAvatar = ({ user = {}, userStore, isLoading }) => {
  const { handleToggle, toggle } = useToggle({ createMessage: false });

  return (
    <div className="break-words">
      <div className="relative flex mb-4 lg:flex-col lg:items-center lg:text-center">
        {isLoading ? (
          <Skeleton circle={true} width={168} height={168} />
        ) : (
          <UserItem user={user} size="xl" className="mb-4 mr-4 lg:mr-0 " />
        )}

        <div className="content-center grid">
          <div className="font-semibold">{user.displayName}</div>
          <div className="font-semibold uppercase text-primary">{user.name}</div>
          <div className="break-all">{user.email}</div>
          <div className="font-normal uppercase">{user.role}</div>
        </div>
      </div>
      {userStore.user && user._id !== userStore.user._id && (
        <button
          className="w-full mb-4 lg:text-xs btn btn-outline"
          onClick={() => handleToggle({ createMessage: !toggle.createMessage })}
        >
          Message me
        </button>
      )}

      {userStore.user && user._id === userStore.user._id && (
        <a href="https://peplinkid.peplink.com/profile" target="_blank" rel="noopener noreferrer">
          <div className="w-full mb-4 text-center lg:text-xs btn bg-primary text-secondary">Edit Profile Picture</div>
        </a>
      )}

      {toggle.createMessage && (
        <CreateMessageModal
          onToggle={(show) => handleToggle({ createMessage: show || !toggle.createMessage })}
          toUser={user.displayName}
        />
      )}
    </div>
  );
};

export default inject(({ userStore }) => ({ userStore }))(observer(UserAvatar));
