import cx from 'classnames';
import React from 'react';

export default ({ children, className }) => {
  return <div className={cx('bottom-0 flex items-center justify-end', className)}>{children}</div>;
};
