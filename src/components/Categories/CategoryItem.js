import { colorHex } from 'utils';
import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import React from 'react';

const Component = ({ isClickable, className, style, data, children, to }) => (
  <>
    {isClickable ? (
      <Link className={className} key={data._id} style={style} to={to}>
        {children}
      </Link>
    ) : (
      <span style={style} className={className}>
        {children}
      </span>
    )}
  </>
);
export default (props) => {
  const {
    data: { color, read_restricted, name, desc, child, slug },
  } = props;

  return (
    <div style={{ borderColor: colorHex(color) }} className="block py-2 pl-4 border-l-4">
      <div className="flex items-center">
        <Component {...props} to={`${ROUTES.CATEGORY_DETAILS}/${slug}`}>
          {read_restricted && <i className="mr-2 material-icons md-16 archived">lock</i>}
          <strong className="text-lg category-title">{name}</strong>
        </Component>
      </div>
      <div className="text-gray-600">{desc}</div>
      {child &&
        child
          ?.filter((i) => !i.deleted)
          .map((i) => (
            <Component key={i._id} {...props} to={`${ROUTES.CATEGORY_DETAILS}/${slug}/${i.slug}`}>
              <span key={i._id} className="inline-flex items-center mr-4 text-sm">
                <i className="inline-block w-2 h-2 mr-1" style={{ backgroundColor: colorHex(i.color) }}></i> {i.name}
              </span>
            </Component>
          ))}
    </div>
  );
};
