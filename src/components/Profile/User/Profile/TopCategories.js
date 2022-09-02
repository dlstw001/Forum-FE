import CategoryLine from 'components/common/CategoryLine';
import React from 'react';

export default ({ user = {} }) => {
  return (
    <>
      <div className="py-2 statistics">
        <h4 className="summary-subtitle">Top Categories</h4>
        <div className="overflow-auto grid grid-cols-2 gap-6">
          <table className="text-black lg:text-sm">
            <thead>
              <tr>
                <th scope="col" className="text-left"></th>
                <th scope="col" className="p-2 font-semibold">
                  Topics
                </th>
                <th scope="col" className="p-2 font-semibold">
                  Replies
                </th>
              </tr>
            </thead>
            <tbody>
              {user.topCategory?.slice(0, 6).map((item, index) => (
                <tr key={index}>
                  <td data-label="category" className="p-1">
                    <CategoryLine category={item.category} hasChild={item.hasChild} />
                  </td>
                  <td data-label="Seen" className="text-center">
                    {item.post}
                  </td>
                  <td data-label="Topics Viewed" className="text-center">
                    {item.reply}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
