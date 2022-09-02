import { getTopicUrl } from 'utils';
import { Link } from 'react-router-dom';
import { Preview } from 'components/common/Form/Editor';
import { ROUTES } from 'definitions';
import CreateMessageModal from 'components/common/modals/CreateMessageModal';
import cx from 'classnames';
import React from 'react';
import transform from 'components/Topics/transform';
import UserPopover from 'components/common/UserPopover';
import useToggle from 'hooks/useToggle';

export default ({ index, post, item }) => {
  const [user, setUser] = React.useState();
  const buttonRef = React.useRef(null);

  const { handleToggle, toggle } = useToggle({
    solution: false,
    userPopover: false,
  });
  const [content, setContent] = React.useState();
  const reply = React.useMemo(() => {
    return item.reply;
  }, [item.reply]);

  React.useEffect(() => {
    const process = async () => {
      const res = await transform(reply.raw || reply.content);
      setContent(res);
    };
    process();
  }, [reply.content, reply.raw]);

  const handleUserClick = React.useCallback(
    (e) => {
      e.preventDefault();
      setUser(reply.creator?.displayName);
      buttonRef.current = e.target;
      handleToggle({ userPopover: true });
    },
    [handleToggle, reply.creator]
  );

  return (
    <div key={index} className="solution-field">
      <div className="flex items-center">
        <span className="">
          <i className="mr-2 md-20 material-icons">check_box</i>
          Solved by{' '}
          <Link
            onClick={handleUserClick}
            to={`${ROUTES.PROFILE}/${reply.creator.displayName.toLowerCase()}`}
            className="text-primary-dark"
          >
            <span>{reply.creator.displayName + ' '}</span>
          </Link>
          in{' '}
          <Link className="text-primary-dark" to={getTopicUrl(post, reply.replyNo)}>
            post #{reply.replyNo}
          </Link>
        </span>

        <button onClick={() => handleToggle({ solution: !toggle.solution })} className="ml-auto btn btn-icon">
          <span className="material-icons bg-gray-50">
            {toggle.solution ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
          </span>
        </button>
      </div>

      <div className={cx('mt-4', { hidden: !toggle.solution })}>{<Preview data={content} />}</div>
      {toggle.userPopover && (
        <UserPopover
          onToggleMessage={() => handleToggle({ createMessage: true })}
          user={user}
          onClose={() => handleToggle({ userPopover: false })}
          buttonRef={buttonRef}
        />
      )}

      {toggle.createMessage && (
        <CreateMessageModal
          onToggle={(show) => handleToggle({ createMessage: show || !toggle.createMessage })}
          toUser={user}
        />
      )}
    </div>
  );
};
