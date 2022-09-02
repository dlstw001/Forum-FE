import { dateFormat } from 'utils';
import React from 'react';

export default ({ user = {} }) => {
  return (
    <>
      <div className="mb-4 statistics">
        <h4 className="summary-subtitle">Recently used devices</h4>
        <div className="flex-wrap grid gap-4 md:grid-flow-col grid-cols-3 md:grid-cols-none">
          {user.recentDevices?.map((item, index) => (
            <div key={index}>
              <div className="flex">
                <div className="mr-4 font-semibold text-center">
                  <i className="text-4xl material-icons">laptop</i>
                  <div>{item.device}</div>
                </div>
                <div className="font-semibold">
                  <div>{item.ip}</div>
                  <div>{dateFormat(item.date)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
