import { dateFormat } from 'utils';
import React from 'react';

export default ({ items }) => {
  return (
    <>
      <thead>
        <tr>
          <th scope="col" className="text-left">
            Subject
          </th>
          <th scope="col" className="text-left">
            Action
          </th>
          <th scope="col" className="text-right">
            Created
          </th>
        </tr>
      </thead>
      <tbody>
        {items.data.map((item, index) => (
          <tr key={index}>
            <td data-label="Subject" className="text-left">
              {item.subject}
            </td>
            <td data-label="Action" className="text-left">
              {item.action}
            </td>
            <td data-label="Created" className="text-right">
              {dateFormat(item.createdAt)}
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );
};
