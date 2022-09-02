import cx from 'classnames';
import React from 'react';

export default ({ current, onClick, tabs = [], className }) => {
  return (
    <div className="flex mb-4 mr-8">
      <ul className="side-tabs-group">
        {tabs.map((tab) => (
          <li key={tab.value}>
            <button className={cx(className, { active: current === tab.value })} onClick={() => onClick(tab.value)}>
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
