import { colorHex } from 'utils';
import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import cx from 'classnames';
import React from 'react';

export default ({ category, className }) => {
  return (
    <div className={cx('flex items-center', className)}>
      {category?.read_restricted && <i className="material-icons md-14 archived">lock</i>}
      <div className="flex items-center text-sm whitespace-no-wrap gap-4">
        {category?.parent && typeof category.parent === 'object' && (
          <Link to={`${ROUTES.CATEGORY_DETAILS}/${category.parent.slug}`}>
            <i
              style={{ color: category.parent?.color ? colorHex(category.parent?.color) : '' }}
              className="icon-folder material-icons material-icons-sharp md-14"
            >
              folder
            </i>
            {category.parent.name}
          </Link>
        )}
        <Link to={`${ROUTES.CATEGORY_DETAILS}/${category?.slug}`}>
          <i
            style={{ color: category?.color ? colorHex(category?.color) : '' }}
            className="icon-folder material-icons material-icons-sharp md-14"
          >
            folder
          </i>
          {category?.name}
        </Link>
      </div>
    </div>
  );
};
