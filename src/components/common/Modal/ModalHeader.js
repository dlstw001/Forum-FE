import cx from 'classnames';
import React from 'react';

export default ({ children, onToggle, className = { 'border-b': true } }) => {
  return (
    <div className={cx('z-10 flex flex-row items-center w-full mb-6 border-gray-300', className)}>
      <div className="modal-header">{children}</div>
      {onToggle && (
        <button onClick={() => onToggle(false)} className="btn btn-close material-icons md-18" data-cy="modal_close">
          close
        </button>
      )}
    </div>
  );
};
