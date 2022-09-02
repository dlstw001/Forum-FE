import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import cx from 'classnames';
import React from 'react';

const CardWrapper = ({ isClickable, data, children }) =>
  isClickable ? (
    <Link to={`${data.hasChild ? ROUTES.CATEGORIES : ROUTES.CATEGORY_DETAILS}/${data.slug}`}>{children}</Link>
  ) : (
    <div>{children}</div>
  );

export default ({ data, isClickable, className }) => {
  return (
    <div className={cx('w-full m-auto trending', className)}>
      <CardWrapper data={data} isClickable={isClickable}>
        <div
          className="relative"
          style={{
            backgroundImage: data.image
              ? `url(${process.env.REACT_APP_API_SERVER}/category/image/${data.image?.filename})`
              : 'url(/assets/forum_img-placeholder.jpg)',
          }}
        >
          <div className="items-meta">
            <div className="category-title">{data.name}</div>
          </div>
        </div>
      </CardWrapper>
    </div>
  );
};
