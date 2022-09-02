import { getTopicUrl, timeAgoFormat } from 'utils';
import { Link } from 'react-router-dom';
import AvatarMedia from 'components/common/AvatarMedia';
import React from 'react';

export default ({ data }) => {
  const { post } = data;

  return (
    <div className="mb-6 topic-row topic-row-bottom">
      <AvatarMedia user={data.creator} data={post || data}>
        <div className="last-activity">
          Last Activity: {data.lastModified ? timeAgoFormat(data.lastModified) : timeAgoFormat(data.createdAt)}
        </div>
      </AvatarMedia>
      <Link to={data.post === undefined ? getTopicUrl(data) : getTopicUrl(data.post, data.replyNo)}>
        <p className="py-4">{data.summary}</p>
      </Link>
    </div>
  );
};
