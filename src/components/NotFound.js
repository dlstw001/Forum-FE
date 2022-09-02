import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { LOGIN_URL } from 'definitions';
import React from 'react';

const NotFound = ({ userStore }) => (
  <div className="fullscreen-loading">
    <h4>Oops! That page doesn’t exist or is private.</h4>
    {userStore?.user ? (
      <Link to="/" className="inline-block mt-4 btn btn-outline">
        Go to home
      </Link>
    ) : (
      <a href={LOGIN_URL} className="inline-block mt-4 btn btn-outline">
        Sign In
      </a>
    )}
  </div>
);

export default inject(({ userStore }) => ({ userStore }))(observer(NotFound));
