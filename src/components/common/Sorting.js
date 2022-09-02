import cx from 'classnames';
import React from 'react';

export default ({ current, onClick, tabs = [], children, className }) => {
  return (
    <>
      <div className={cx('flex items-center cursor-pointer', className)}>
        <h3 className="filter-title">Sort by</h3>
        <select value={current} onChange={(e) => onClick(e.target.value)}>
          {tabs.map((i, index) => (
            <option key={index} value={i.value} className="filter-items">
              {i.label}
            </option>
          ))}
        </select>
      </div>
      {children}
    </>
  );
};
