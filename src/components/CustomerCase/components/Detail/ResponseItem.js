import { dateFormat } from 'utils';
import { Preview } from 'components/common/Form/Editor';
import cx from 'classnames';
import React from 'react';

export default ({ data, className }) => {
  return (
    <div className={cx('flex items-start mb-8', className)}>
      <img src={data.author_avatar_urls[96]} alt="..." className="w-12 mr-8 rounded-full" />
      <div className="flex-grow">
        <strong className="text-lg font-bold leading-8">{data?.author_name}</strong>
        <p className="text-sm leading-tight capitalize">{dateFormat(data?.date)}</p>
        <div className="mb-4">
          <Preview data={data?.content?.rendered} />
        </div>
      </div>
    </div>
  );
};
