import { Link } from 'react-router-dom';
import React from 'react';

export default ({ children, url }) => {
  return (
    <div className="sidebar-items-row">
      <div className="sidebar-items">
        <Link to={url}>{children}</Link>
      </div>
    </div>
  );
};
