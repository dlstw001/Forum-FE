import CategoryLine from 'components/common/CategoryLine';
import React from 'react';

export default ({ results }) => {
  return (
    <div className="categories">
      {!!results.categories.data.length && (
        <>
          <p>Categories</p>
          {results.categories.data.map((i) => (
            <div className="mb-4" key={i._id}>
              <CategoryLine category={i} hasChild={i.hasChild} />
            </div>
          ))}
        </>
      )}
    </div>
  );
};
