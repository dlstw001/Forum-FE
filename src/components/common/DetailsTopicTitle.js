import { htlmToPlainText } from 'utils';
import cx from 'classnames';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

export default ({ data }) => {
  const title = React.useMemo(() => {
    return htlmToPlainText(data.item.title);
  }, [data.item.title]);

  return (
    <h2 className="flex items-start leading-tight post-title">
      <div className="post-status">
        {(data.item?.isPinned || data.item.isPinnedGlobally) &&
          (data.item.isPinnedUntil === null || new Date(data.item.isPinnedUntil) > new Date()) && (
            <i className="mr-2 md-18 material-icons text-primary-dark">push_pin</i>
          )}
        {data.item?.accepted_answers && !!data.item?.accepted_answers.length && (
          <i className="material-icons md-16 solved">check_box</i>
        )}
        {data.item.archived && <i className="material-icons md-16 archived">lock</i>}
        {data.item.closed && <i className="material-icons md-16 closed">lock</i>}
        {data.item.unlisted && <i className="material-icons md-16 unlisted">visibility</i>}
        {data.item.deleted && <i className="material-icons text-danger">delete</i>}
      </div>
      {<span className={cx('word-break', { 'text-danger': data?.item?.deleted })}>{title}</span> || (
        <Skeleton width={200} />
      )}
    </h2>
  );
};
