import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import cx from 'classnames';
import React from 'react';

export default ({ title, link, between, className }) => {
  return (
    <div className={cx('breadcrumb', className)}>
      <Link to={ROUTES.CATEGORY_DETAILS}>
        Community<span className="slash">/</span>
      </Link>
      {between && (
        <Link to={between.link}>
          {between.title}
          <span className="slash">{'/'}</span>
        </Link>
      )}
      <Link to={link ? link : window.location.pathname} className="capitalize text-primary-dark">
        {title}
      </Link>
    </div>
  );
};
