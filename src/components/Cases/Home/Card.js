import { differenceInCalendarDays } from 'date-fns';
import { Link } from 'react-router-dom';
import { parseHTML } from 'utils';
import { ROUTES } from 'definitions';
import cx from 'classnames';
import React from 'react';

export default ({ methods, data, onChange }) => {
  const onClickTag = (tag) => {
    methods.setValue('tags', [tag]);
    onChange();
  };

  const shouldRenderDot = (date) => differenceInCalendarDays(new Date(), new Date(date)) <= 3;

  return (
    <div className="relative mb-4">
      <Link to={`${ROUTES.CASES}/${data.slug}`} data-cy={`customer_case_${data.title}`}>
        <div
          className="mb-4 customer-case-card"
          style={{ backgroundImage: `url(${data.image ? data.image : '/assets/forum_img-placeholder.jpg'})` }}
        />
        <div className="flex items-center case-title">
          <div className="post-status">
            {data?.accepted_answers && !!data?.accepted_answers.length && (
              <i className="material-icons md-16 solved">check_box</i>
            )}
            {data.archived && <i className="material-icons md-16 archived">lock</i>}
            {data.closed && <i className="material-icons md-16 closed">lock</i>}
            {data.unlisted && <i className="material-icons md-16 unlisted">visibility</i>}
          </div>
          <span className={cx('word-break', { 'text-danger': data?.deleted })}>{parseHTML(data.title)}</span>
          {data.noUnReadReply !== undefined && data.noUnReadReply !== 0 && (
            <div className="bubble-unread">{data.noUnReadReply}</div>
          )}
          {shouldRenderDot(data.createdAt) && <div className="new-dot" alt="New Topic" />}
        </div>
      </Link>
      <div className="flex flex-wrap">
        {data.tags?.map((i) => (
          <button className="mb-2 mr-2 tags" key={i._id} onClick={() => onClickTag(i)}>
            {i.name}
          </button>
        ))}
      </div>
    </div>
  );
};
