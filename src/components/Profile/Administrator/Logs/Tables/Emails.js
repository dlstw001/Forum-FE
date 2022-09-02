import { dateFormat } from 'utils';
import React from 'react';

export default ({ items }) => {
  return (
    <>
      <thead>
        <tr>
          <th scope="col" className="text-left">
            Email
          </th>
          <th scope="col" className="text-left">
            IP Address
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
            <td data-label="Email" className="text-left">
              {item.email}
            </td>
            <td data-label="IP" className="text-left">
              {item.ip_address}
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
