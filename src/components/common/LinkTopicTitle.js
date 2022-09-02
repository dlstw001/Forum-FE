/* eslint-disable react-hooks/exhaustive-deps */
import { differenceInCalendarDays } from 'date-fns';
import { getTopicUrl } from 'utils';
import { htlmToPlainText } from 'utils';
import { Link } from 'react-router-dom';
import CategoryLine from './CategoryLine';
import cx from 'classnames';
import React from 'react';

export default ({ data, className, category, urlGenerator = getTopicUrl }) => {
  const shouldRenderDot = (date) => differenceInCalendarDays(new Date(), new Date(date)) <= 3;

  const title = React.useMemo(() => htlmToPlainText(data.title));
  return (
    <div className={className}>
      <h1 className={cx('flex topic-title', { read: data?.read && data?.noUnReadReply === 0 })}>
        <div className="post-status">
          {(data.pinnedGlobally || data.pinnedLocally) && <i className="material-icons md-16 pinned">push_pin</i>}
          {data.solved && <i className="material-icons md-16 solved">check_box</i>}
          {data.archived && <i className="material-icons md-16 archived">lock</i>}
          {data.closed && <i className="material-icons md-16 closed">lock</i>}
          {data.unlisted && <i className="material-icons md-16 unlisted">visibility</i>}
          {data.deleted && <i className="material-icons md-16 text-danger">delete</i>}
        </div>
        {data.slug ? (
          <Link
            to={urlGenerator(data)}
            data-cy={`${data.title}`}
            className={cx('word-break', { 'text-danger': data.deleted })}
          >
            {title}
          </Link>
        ) : (
          <div data-cy={`${data.title}`}>{title}</div>
        )}
        {data.noUnReadReply !== undefined && data.noUnReadReply !== 0 && (
          <div className="bubble-unread" title="Unread Replies">
            {data.noUnReadReply}
          </div>
        )}
        {shouldRenderDot(data.createdAt) && <div className="new-dot" alt="New Topic" />}
      </h1>
      {category && <CategoryLine category={category} hasChild={data.categoryHasChild} />}
    </div>
  );
};
