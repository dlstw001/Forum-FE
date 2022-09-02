import AvatarMedia from 'components/common/AvatarMedia';
import React from 'react';

export default ({ items }) => {
  return (
    <div className="w-full overflow-auto table-responsive">
      {items.data.map((i) => (
        <div className="mb-6 topic-row topic-row-bottom" key={i._id}>
          <div className="mb-4 md:flex">
            <AvatarMedia data={i} user={i.creator} />
          </div>
          <p>{i.summary}</p>
        </div>
      ))}
    </div>
  );
};
