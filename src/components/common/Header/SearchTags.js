import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import React from 'react';

export default ({ results, handleCTR }) => {
  return (
    <>
      {!!results.tags.data.length && (
        <div className="mb-8">
          {results.tags.data.map((i) => (
            <Link
              to={`${ROUTES.TAG}/${i.name}`}
              key={i._id}
              className="mr-2 tags"
              onClick={() => handleCTR(results.log.item._id)}
            >
              {i.name}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};
