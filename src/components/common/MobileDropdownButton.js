import cx from 'classnames';
import React from 'react';

export default ({ title, children, onToggle, isOpen, className }) => {
  return (
    <div className={cx('flex mb-6', className)}>
      <button onClick={onToggle} className="flex mr-2 uppercase text-primary lg:hidden">
        <i className="mr-2 material-icons">sort</i>
        <h3 className="mobile-dropdown-title">
          {title}
          <i className="material-icons">{isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
        </h3>
      </button>
      {children}
    </div>
  );
};
