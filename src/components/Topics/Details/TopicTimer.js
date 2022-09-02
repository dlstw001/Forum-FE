import { formatDistanceToNow, parseISO } from 'date-fns';
import { inject } from 'mobx-react';
import React from 'react';
import ReminderModal from 'components/common/modals/ReminderModal';
import useToggle from 'hooks/useToggle';

const TopicTimerList = ({ timerStore, timer = {}, id, onSuccess, userStore }) => {
  const { handleToggle, toggle } = useToggle({ confirmDelete: false });
  const countdown = React.useCallback((date) => {
    return date && formatDistanceToNow(parseISO(date));
  }, []);

  const handleDelete = () => {
    timerStore.delete(id);
    onSuccess();
  };

  return (
    <div className="flex items-center mb-2">
      {!timer.executed && (
        <>
          <div className="py-2">
            <i className="mr-2 material-icons md-18">schedule</i> This topic will be automatically {timer.action} in{' '}
            {countdown(timer.execution_time)}
          </div>
          {userStore.IS_ADMIN_OR_MODERATOR && (
            <button
              onClick={() => handleToggle({ confirmDelete: !toggle.confirmDelete })}
              className="ml-auto btn-icon btn"
            >
              <i className="material-icons">delete</i>
            </button>
          )}
        </>
      )}

      {toggle.confirmDelete && (
        <ReminderModal
          onToggle={() => handleToggle({ confirmDelete: !toggle.confirmDelete })}
          title="Delete Timer"
          message="Are you sure you want to delete?"
          onHandle={handleDelete}
        />
      )}
    </div>
  );
};

export default inject(({ timerStore, userStore }) => ({ timerStore, userStore }))(TopicTimerList);
