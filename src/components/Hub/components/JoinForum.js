import { ROOT_ROUTES } from 'definitions';
import React from 'react';

export default () => {
  return (
    <section
      id="join-forum"
      className="container px-3 pt-8 mx-auto mb-24 wow fadeInUp"
      data-wow-duration="400ms"
      data-wow-delay="100ms"
    >
      <div className="grid gap-12 lg:grid-cols-2 sm:grid-cols-1">
        <div className="bg-join-forum" style={{ backgroundImage: "url('/assets/hub/join-forum.png')" }}></div>
        <div id="join-details" className="text-center grid place-content-center">
          <div className="mb-6 join-title">Join Our Peplink Forum</div>
          <div className="mb-8 join-description">
            Ask questions, find answers, make new discoveries, and connect with others around the world who share the
            same passion for all things Peplink.
          </div>
          <div className="inline-block">
            <a href={ROOT_ROUTES.FORUM} className="btn btn-primary">
              Explore the Forum
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
