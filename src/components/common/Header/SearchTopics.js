import { getTopicUrl } from 'utils';
import { Link } from 'react-router-dom';
import { parseHTML } from 'utils';
import { ROUTES } from 'definitions';
import React from 'react';

export default ({ results, value, handleCTR }) => {
  return (
    <>
      {!!results?.posts?.data?.length && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Topics</h2>
            <Link className="show-all" to={`${ROUTES.SEARCH}?term=${value}`} data-cy="search_show_all">
              View all topics
            </Link>
          </div>
          <ul className="search-data">
            {!!results.posts.data.length &&
              results.posts.data.map((i, index) => (
                <li key={index}>
                  <Link to={getTopicUrl(i)} onClick={() => handleCTR(results.log.item._id)}>
                    <p className="search-result-title">{parseHTML(i.title)}</p>
                    <p className="search-result-summary">{i.summary}</p>
                  </Link>
                </li>
              ))}
          </ul>
        </>
      )}
    </>
  );
};
