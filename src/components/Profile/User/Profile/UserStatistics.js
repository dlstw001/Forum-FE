import { daysVisited } from 'utils';
import React from 'react';

export default ({ user = {} }) => {
  const Statistics = [
    {
      value: daysVisited(user.readingTime) || 0,
      label: 'days visited',
      _id: '1',
    },
    {
      value: `${user.readingTime ? (parseInt(user.readingTime) / 60 / 60).toFixed(2) + 'h' : 0}`,
      label: 'read time',
      _id: '2',
    },
    {
      value: user.postViews ? user.postViews : 0,
      label: 'topics viewed',
      _id: '3',
    },
    {
      value: user.replyViews ? user.replyViews : 0,
      label: 'reply viewed',
      _id: '4',
    },
    {
      value: user.noPost ? user.noPost : 0,
      label: 'topics created',
      _id: '5',
    },
    {
      value: user.noReply ? user.noReply : 0,
      label: 'replies created',
      _id: '6',
    },
    {
      value: user.noLikeGiven ? user.noLikeGiven : 0,
      label: (
        <div className="flex items-center justify-center">
          <i className="mr-2 material-icons md-18 btn-liked">favorite</i>
          given
        </div>
      ),
      _id: '7',
    },
    {
      value: user.noLikeReceived ? user.noLikeReceived : 0,
      label: (
        <div className="flex items-center justify-center">
          <i className="mr-2 material-icons md-18 btn-liked">favorite</i>
          received
        </div>
      ),
      _id: '8',
    },
  ];
  return (
    <>
      <div className="mb-4 statistics">
        <h4 className="summary-subtitle">Statistics</h4>
        <div className="flex-wrap grid gap-4 md:grid-flow-col grid-cols-4 md:grid-cols-none">
          {Statistics.map((item, index) => (
            <div key={index}>
              <h1 className="statistic-item-value">{item.value}</h1>
              <h6 className="statistic-item-label">{item.label}</h6>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
