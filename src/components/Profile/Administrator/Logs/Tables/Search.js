import React from 'react';

export default ({ items }) => {
  return (
    <>
      <thead>
        <tr>
          <th scope="col" className="text-left">
            Term
          </th>
          <th scope="col" className="text-right">
            CTR
          </th>
        </tr>
      </thead>
      <tbody>
        {items.data.map((item, index) => (
          <tr key={index}>
            <td data-label="Term" className="text-left">
              {item.term}
            </td>
            <td data-label="CTR" className="text-right">
              {item.ctr}
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );
};
