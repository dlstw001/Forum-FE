import { getTopicUrl } from 'utils';
import CreateMessageModal from 'components/common/modals/CreateMessageModal';
import LinkTopicTitle from './LinkTopicTitle';
import React from 'react';
import UserItem from './UserItem';
import UserPopover from 'components/common/UserPopover';
import useToggle from 'hooks/useToggle';

export default ({
  user,
  data,
  size = 'md',
  children,
  urlGenerator = getTopicUrl,
  topComponent,
  showPopup = false,
  ...rest
}) => {
  const buttonRef = React.useRef(null);
  const { toggle, handleToggle } = useToggle({
    createMessage: false,
    userPopover: false,
  });

  const handleAvatarClick = React.useCallback(
    (e) => {
      buttonRef.current = e.target;
      handleToggle({ userPopover: true });
    },
    [handleToggle]
  );

  const onClose = React.useCallback(() => handleToggle({ userPopover: false }), [handleToggle]);
  return (
    <>
      <div className="flex" {...rest}>
        <UserItem user={user} size={size} className="mr-4" {...(showPopup && { onClick: handleAvatarClick })} />
        <div>
          {topComponent}
          {data && <LinkTopicTitle urlGenerator={urlGenerator} data={data} category={data.category} />}
          {children}
        </div>
      </div>
      {toggle.userPopover && (
        <UserPopover
          onToggleMessage={() => handleToggle({ createMessage: true })}
          user={user?.displayName}
          onClose={onClose}
          buttonRef={buttonRef}
        />
      )}
      {toggle.createMessage && (
        <CreateMessageModal
          onToggle={(show) => handleToggle({ createMessage: show || !toggle.createMessage })}
          toUser={user?.displayName}
        />
      )}
    </>
  );
};
