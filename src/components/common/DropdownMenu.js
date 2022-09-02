import React from 'react';

export default ({ item, handleClick }) => {
  return (
    <li>
      <button onClick={handleClick} data-cy={item['data-cy']} className="capitalize">
        {item.icon && <i className="mr-2 material-icons md-14">{item.icon}</i>}
        {item.label}
      </button>
    </li>
  );
};
