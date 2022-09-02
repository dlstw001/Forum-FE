import { ROUTES } from 'definitions';
import { useHistory } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';

export default () => {
  let history = useHistory();

  //JUMP TO
  useHotkeys('g+h', () => {
    history.push('/');
  });

  useHotkeys('g+l', () => {
    window.location.href = `${ROUTES.TOPIC}?type=latest`;
  });

  useHotkeys('g+n', () => {
    window.location.href = `${ROUTES.TOPIC}?type=activity`;
  });

  useHotkeys('g+u', () => {
    window.location.href = `${ROUTES.TOPIC}?type=unread`;
  });

  useHotkeys('g+c', () => {
    history.push(`${ROUTES.CATEGORIES}`);
  });

  useHotkeys('g+b', () => {
    history.push(`${ROUTES.BOOKMARKS}`);
  });

  useHotkeys('g+p', () => {
    document.querySelector('[data-key=view_profile]') && document.querySelector('[data-key=view_profile]').click();
  });

  useHotkeys('g+m', () => {
    document.querySelector('[data-key=hamburger_messages]') &&
      document.querySelector('[data-key=hamburger_messages]').click();
  });

  useHotkeys('g+d', () => {
    document.querySelector('[data-key=hamburger_drafts]') &&
      document.querySelector('[data-key=hamburger_drafts]').click();
  });

  //NAVITATION
  useHotkeys('u', () => {
    history.goBack();
  });

  //APPLICATION
  useHotkeys('=', () => {
    document.querySelector('[data-key=view_hamburger]') && document.querySelector('[data-key=view_hamburger]').click();
  });

  useHotkeys('p', () => {
    document.querySelector('[data-key=user_avatar]') && document.querySelector('[data-key=user_avatar]').click();
  });

  useHotkeys('/', (e) => {
    e.preventDefault();
    document.querySelector('[data-key=search]') && document.querySelector('[data-key=search]').click();
  });

  //ACTIONS
  useHotkeys('shift+p', () => {
    document.querySelector('[data-key=pin_topic]') && document.querySelector('[data-key=pin_topic]').click();
  });

  useHotkeys('l', () => {
    document.querySelector('[data-key=like_topic]') && document.querySelector('[data-key=like_topic]').click();
  });

  // useHotkeys('!', () => {
  //   document.querySelector('[data-key=flag_topic]') && document.querySelector('[data-key=flag_topic]').click();
  // });

  useHotkeys('b', () => {
    document.querySelector('[data-key=bookmark_topic]') && document.querySelector('[data-key=bookmark_topic]').click();
  });

  useHotkeys('e', () => {
    document.querySelector('[data-key=edit_topic]') && document.querySelector('[data-key=edit_topic]').click();
  });

  useHotkeys('d', () => {
    document.querySelector('[data-key=delete_topic]') && document.querySelector('[data-key=delete_topic]').click();
  });

  useHotkeys('shift+a', () => {
    document.querySelector('[data-key=open_topic_admin_actions]') &&
      document.querySelector('[data-key=open_topic_admin_actions]').click();
  });

  useHotkeys('shift+z', () => {
    document.querySelector('[data-key=user_logout]') && document.querySelector('[data-key=user_logout]').click();
  });

  useHotkeys('shift+/', () => {
    document.querySelector('[data-key=hamburger_keyboard_shortcut]') &&
      document.querySelector('[data-key=hamburger_keyboard_shortcut]').click();
  });
};
