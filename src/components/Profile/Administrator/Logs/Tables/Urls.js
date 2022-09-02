import { dateFormat } from 'utils';
import React from 'react';

export default ({ items }) => {
  return (
    <>
      <thead>
        <tr>
          <th scope="col" className="text-left">
            Domain
          </th>
          <th scope="col" className="text-center">
            Matching Count
          </th>
          <th scope="col" className="text-right">
            Last matching at
          </th>
        </tr>
      </thead>
      <tbody>
        {items.data.map((item, index) => (
          <tr key={index}>
            <td data-label="URL" className="text-left">
              {item.domain}
            </td>
            <td data-label="Match Count" className="text-center">
              {item.match_count}
            </td>
            <td data-label="Created" className="text-right">
              {dateFormat(item.last_match_at)}
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );
};
