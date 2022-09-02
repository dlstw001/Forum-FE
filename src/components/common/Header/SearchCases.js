import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import HtmlParser from 'react-html-parser';
import React from 'react';

export default ({ results, value }) => {
  return (
    <>
      {!!results?.cases?.data?.length && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Cases</h2>
            <Link className="show-all" to={`${ROUTES.CASES}?term=${value}`} data-cy="search_show_all">
              View all Cases
            </Link>
          </div>
          <ul className="search-data">
            {!!results.cases.data.length &&
              results.cases.data.map((i) => (
                <li key={i._id}>
                  <Link to={`${ROUTES.CASES}/${i.slug}`}>
                    <p className="search-result-title">{HtmlParser(i.title)}</p>
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
