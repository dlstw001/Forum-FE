import cx from 'classnames';
import HtmlParser from 'react-html-parser';
import React from 'react';

export default ({ data, className }) => {
  return (
    <div className={cx('carousel-slide', className)}>
      <div className="cases">
        <a href={data.slug}>
          <div className="relative background-overlay" style={{ backgroundImage: `url(${data?.image})` }}></div>
        </a>

        <div className="details bg-secondary">
          <a href={data.slug}>
            <div className="case-title">{HtmlParser(data?.title)}</div>
          </a>
          <div className="case-description">{data?.summary}</div>
          <a href={data.slug} className="read-case">
            Read Case <i className="ml-4 fas fa-chevron-right"></i>
          </a>
        </div>
      </div>
    </div>
  );
};
