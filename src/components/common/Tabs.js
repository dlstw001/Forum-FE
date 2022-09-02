import cx from 'classnames';
import React from 'react';

export default ({ current, onClick, tabs = [], children, className, containerClassname }) => {
  return (
    <>
      <ul className={cx('flex-wrap my-8 lg:flex tab-menu w-full', containerClassname)}>
        {tabs.map((tab) => (
          <li key={tab.value}>
            <button
              className={cx(className, { active: current === tab.value })}
              onClick={() => current !== tab.value && onClick(tab.value)}
              data-cy={tab['data-cy']}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      {children}
    </>
  );
};
