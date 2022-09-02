import React from 'react';

export default ({ data }) => {
  return (
    <div className="col-span-1 bg-secondary">
      <div className="event-thumbnail" style={{ backgroundImage: `url(${data.image})` }}></div>
      <div className="event-details">
        <div className="event-title">{data.title}</div>
        <div className="event-description">{data.excerpt}</div>

        {data.call_to_action && (
          <a
            href={data.redirect_url}
            title={data.title}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            {data.call_to_action}
          </a>
        )}
      </div>
    </div>
  );
};
