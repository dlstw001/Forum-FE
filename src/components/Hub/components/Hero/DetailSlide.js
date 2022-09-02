import React from 'react';

export default ({ item }) => (
  <div key={item.id}>
    <div className="flex items-center justify-end">
      <div className="banner-details">
        <div className="banner-title">{item.title}</div>
        <div className="banner-excerpt">{item.excerpt}</div>
        {item.redirect_url && (
          <a
            className="btn btn-banner"
            href={item.redirect_url}
            title={item.title}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.call_to_action}
          </a>
        )}
        {item.youtube_url && (
          <a
            className="btn btn-banner"
            data-fancybox
            data-small-btn="true"
            href={item.youtube_url}
            title={item.title}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.call_to_action}
          </a>
        )}
      </div>
    </div>
  </div>
);
