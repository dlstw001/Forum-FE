import React from 'react';
import ReactHtmlParser from 'react-html-parser';

export default ({ data }) => {
  return (
    <a href={data.redirect_url} target="_blank" rel="noopener noreferrer">
      <div
        id={`post-${data.id}`}
        className="featured-card wow fadeInUp"
        data-wow-duration="600ms"
        data-wow-delay="300ms"
      >
        <div className="grid gap-8 lg:grid-cols-2 xs:grid-cols-1 grid-gap-6">
          <div className="relative latest-thumbnail" style={{ backgroundImage: `url(${data.image})` }}></div>
          <div className="featured-details grid place-content-start">
            <div className="featured-type">
              <span className="mr-1 material-icons material-icons-sharp md-folder">folder</span>
              {data.type}
            </div>
            <div className="featured-title">{data.title}</div>
            <div className="featured-description">{ReactHtmlParser(data.excerpt)}</div>

            {data.redirect_url && (
              <div className="inline-block">
                <button title={data.title} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  {data.call_to_action}
                </button>
              </div>
            )}
            {data.youtube_url && (
              <div className="inline-block">
                <button
                  data-fancybox
                  data-small-btn="true"
                  title={data.title}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  {data.call_to_action}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};
