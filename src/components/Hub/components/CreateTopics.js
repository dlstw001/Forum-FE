import { inject, observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import { LOGIN_URL, ROOT_ROUTES } from 'definitions';
import React from 'react';

const CreateTopics = ({ userStore }) => {
  return (
    <section
      id="create-topics"
      className="container px-3 mx-auto my-12 wow fadeInUp"
      data-wow-duration="600ms"
      data-wow-delay="500ms"
    >
      <div className="grid gap-12 lg:grid-cols-2 sm:grid-cols-1">
        <div id="section-details" className="text-center grid place-content-center lg:order-first xs:order-last">
          <div id="title" className="section-subtitle">
            Got something to discuss with us?
          </div>
          <div className="inline-block">
            {!isEmpty(userStore?.user) ? (
              <a href={`${ROOT_ROUTES.FORUM}?create=true`} className="btn btn-primary btn-create-topics">
                Create Topics
              </a>
            ) : (
              <a href={LOGIN_URL} className="btn btn-primary btn-create-topics">
                Create Topics
              </a>
            )}
          </div>
        </div>
        <div
          className="bg-discuss-at-forum lg:order-first xs:order-1"
          style={{ backgroundImage: 'url("/assets/hub/discuss-at-forum.png")' }}
        />
      </div>
    </section>
  );
};

export default inject(({ userStore }) => ({ userStore }))(observer(CreateTopics));
