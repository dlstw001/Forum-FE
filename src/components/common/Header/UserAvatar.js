import {
  Administrator,
  Announcement,
  Bookmark,
  Categories,
  Draft,
  Logout,
  Message,
  Moderator,
  Profile,
  Settings,
} from './Icons';
import { inject, observer } from 'mobx-react';
import { Link, useHistory } from 'react-router-dom';
import { ROUTES } from 'definitions';
import { useHotkeys } from 'react-hotkeys-hook';
import { usePopper } from 'react-popper';
import CreateMessageModal from 'components/common/modals/CreateMessageModal';
// import CreateSectionModal from 'components/common/modals/SectionModal';
import cx from 'classnames';
import GreetingModal from 'components/common/modals/GreetingModal';
import KeyboardShortcutModal from 'components/common/modals/KeyboardShortcutModal';
import React from 'react';
import TopicModal from '../modals/TopicModal';
import useClickOutside from 'hooks/useClickOutside';
import UserItem from 'components/common/UserItem';
import useToggle from 'hooks/useToggle';
// import WriteCustomerCase from 'components/common/modals/Case/Create';

const UserAvatar = ({ authStore, userStore, user, placement = 'bottom-end' }) => {
  const { handleToggle, toggle } = useToggle({
    // createSectionModal: false,
    // createTopicModal: false,
    // createCustomerCaseModal: false,
    createMessageModal: false,
    greetingModal: false,
    userOptions: false,
    adminOptions: false,
  });

  const history = useHistory();
  const buttonRef = React.useRef(null);
  const popperRef = React.useRef(null);
  const [visible, setVisibility] = React.useState(false);

  useClickOutside({
    onClose: () => {
      setVisibility(false);
    },
    elemRef: buttonRef,
  });

  const { styles, attributes, update } = usePopper(buttonRef.current, popperRef.current, {
    placement,
  });

  React.useEffect(() => {
    const unlisten = history.listen(() => {
      setVisibility(false);
      handleToggle({ userOptions: false, adminOptions: false });
    });
    return () => {
      unlisten();
    };
  }, [history, handleToggle]);

  React.useEffect(() => {
    update && update();
  }, [update, toggle.menu]);

  React.useEffect(() => {
    const FORUM = localStorage.getItem(process.env.REACT_APP_APP_NAME);
    if (FORUM) {
      const { isNew } = JSON.parse(FORUM);
      if (JSON.parse(isNew || false)) {
        handleToggle({ greetingModal: true });
      }
    }
  }, [handleToggle]);

  const handleToggleMenu = () => {
    setVisibility((prevState) => !prevState);
  };

  const handleKeyboardShortcutModal = () => {
    handleToggle({ shortcutModal: true, userOptions: false, adminOptions: false });
    setVisibility(false);
  };

  useHotkeys('c', () => {
    userStore?.user && handleToggle({ createTopicModal: true });
  });

  useHotkeys('shift + /', () => {
    handleKeyboardShortcutModal();
  });

  return (
    <>
      <div ref={buttonRef} className="relative flex items-center h-full ml-3 dropdown">
        <div onClick={handleToggleMenu} data-key="view_hamburger">
          <UserItem user={user} size="md" />
        </div>

        <div
          className={cx('dropdown-menu user-menu-header', { invisible: !visible })}
          ref={popperRef}
          style={styles.popper}
          {...attributes.popper}
        >
          <Link
            to={`${ROUTES.PROFILE}/${user.displayName.toLowerCase()}`}
            className="menu-item profile-link"
            data-key="view_profile"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                {user?.avatar ? <img src={user.avatar} alt={user.displayName} /> : <Profile />}
              </div>
              {user.name}
            </div>
          </Link>
          <>
            <Link to={ROUTES.CATEGORIES} className="border-b menu-item">
              <div className="flex items-center">
                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                  <Categories />
                </div>
                Categories
              </div>
            </Link>
            <Link to={`${ROUTES.CATEGORY_DETAILS}/announcements`} className="border-b menu-item">
              <div className="flex items-center">
                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                  <Announcement />
                </div>
                Announcement
              </div>
            </Link>
            <Link to={ROUTES.BOOKMARKS} className="border-b menu-item">
              <div className="flex items-center">
                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                  <Bookmark />
                </div>
                Bookmarks
              </div>
            </Link>
            <Link to={ROUTES.MESSAGES} className="border-b menu-item" data-key="hamburger_messages">
              <div className="flex items-center">
                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                  <Message />
                </div>
                Private Messages
              </div>
            </Link>
            <Link to={ROUTES.DRAFT} className="border-b menu-item" data-key="hamburger_drafts">
              <div className="flex items-center">
                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                  <Draft />
                </div>
                Draft
              </div>
            </Link>
            <div className={cx('border-b', { 'pb-2 ': toggle.userOptions })}>
              <div className="menu-item" onClick={() => handleToggle({ userOptions: !toggle.userOptions })}>
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                    <Settings />
                  </div>
                  User Preference
                  <i className={cx('ml-auto material-icons', { 'transform rotate-180': toggle.userOptions })}>
                    keyboard_arrow_down
                  </i>
                </div>
              </div>
              <div className={cx('sub-menu', { hidden: !toggle.userOptions })}>
                <Link
                  to={`${ROUTES.PROFILE}/${user.displayName.toLowerCase()}${ROUTES.SETTINGS}`}
                  className="menu-item"
                >
                  Settings
                </Link>
                <button onClick={handleKeyboardShortcutModal} className="menu-item">
                  Keyboard Shortcut
                </button>
              </div>
            </div>
            {userStore?.user.admin && (
              <div className={cx('border-b', { 'pb-2 ': toggle.adminOptions })}>
                <div className="menu-item" onClick={() => handleToggle({ adminOptions: !toggle.adminOptions })}>
                  <div className="flex items-center">
                    <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                      <Administrator />
                    </div>
                    Administrator
                    <i className={cx('ml-auto material-icons', { 'transform rotate-180': toggle.adminOptions })}>
                      keyboard_arrow_down
                    </i>
                  </div>
                </div>
                <div className={cx('sub-menu', { hidden: !toggle.adminOptions })}>
                  <Link to={ROUTES.DASHBOARD} className="menu-item">
                    Dashboard
                  </Link>
                  <Link to={ROUTES.GROUP} className="menu-item">
                    Community Groups
                  </Link>
                  <Link to={ROUTES.USERS} className="menu-item">
                    Community Members
                  </Link>
                  <Link to={ROUTES.LOGS} className="menu-item">
                    Logs
                  </Link>
                  <Link to={ROUTES.BACKUPS} className="menu-item">
                    Backups
                  </Link>
                </div>
              </div>
            )}

            {userStore.IS_ADMIN_OR_MODERATOR && (
              <Link to={ROUTES.REVIEW} className="border-b menu-item">
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                    <Moderator />
                  </div>
                  Moderator
                </div>
              </Link>
            )}

            <button onClick={authStore.logout} className="block w-full menu-item" data-key="user_logout">
              <div className="flex items-center">
                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                  <Logout />
                </div>
                Sign Out
              </div>
            </button>
          </>
        </div>
      </div>

      {/* {toggle.createSectionModal && (
        <CreateSectionModal
          onToggle={(show) => handleToggle({ createSectionModal: show || !toggle.createSectionModal })}
        />
      )} */}
      {toggle.createTopicModal && (
        <TopicModal onToggle={(show) => handleToggle({ createTopicModal: show || !toggle.createTopicModal })} />
      )}
      {/* {toggle.createCustomerCaseModal && (
        <WriteCustomerCase
          onToggle={(show) => handleToggle({ createCustomerCaseModal: show || !toggle.createCustomerCaseModal })}
        />
      )} */}
      {toggle.createMessageModal && (
        <CreateMessageModal
          onToggle={(show) => handleToggle({ createMessageModal: show || !toggle.createMessageModal })}
        />
      )}
      {toggle.shortcutModal && (
        <KeyboardShortcutModal onToggle={(show) => handleToggle({ shortcutModal: show || !toggle.shortcutModal })} />
      )}
      {toggle.greetingModal && (
        <GreetingModal onToggle={(show) => handleToggle({ greetingModal: show || !toggle.greetingModal })} />
      )}
    </>
  );
};

export default inject(({ authStore, userStore }) => ({ authStore, userStore }))(observer(UserAvatar));
