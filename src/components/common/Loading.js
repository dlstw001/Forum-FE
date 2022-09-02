import cx from 'classnames';
import React from 'react';

export default ({ className }) => {
  return <div className={cx('loading', className)} />;
};
