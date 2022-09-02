import { inject, observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import { LOGIN_URL, ROOT_ROUTES } from 'definitions';
import React from 'react';

const WantToFeature = ({ userStore }) => {
  return (
    <section
      id="want-to-feature"
      className="mx-auto my-12 grid place-content-center wow fadeInUp animated"
      data-wow-duration="150ms"
      data-wow-delay="50ms"
      style={{
        backgroundImage: "url('/assets/hub/want_to_be_featured.jpg')",
        visibility: 'visible',
        animationDuration: '150ms',
        animationDelay: '50ms',
        animationName: 'fadeInUp',
      }}
    >
      <h1 className="mb-6 section-title">
        Want to feature above?
        <br />
        Share your latest deployment!
      </h1>
      {!isEmpty(userStore?.user) ? (
        <Link to={`${ROOT_ROUTES.CASE}?create=true`}>
          <button className="btn btn-primary">Create Story</button>
        </Link>
      ) : (
        <a href={LOGIN_URL}>
          <button className="btn btn-primary">Create Topics</button>
        </a>
      )}
    </section>
  );
};

export default inject(({ userStore }) => ({ userStore }))(observer(WantToFeature));
