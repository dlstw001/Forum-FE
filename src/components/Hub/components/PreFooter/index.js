import { ROOT_ROUTES } from 'definitions';
import Item from './Item';
import React from 'react';

export default () => {
  const data = {
    title: 'The possibilities are endless with Peplink',
    items: [
      {
        title: 'Join a Peplink Virtual Webinar',
        excerpt: 'Learn and explore how to get the most out of your Peplink solution ',
        image: '/assets/hub/Webinar_v2-1-600x470_cropped.jpg',
        call_to_action: 'Sign Up',
        redirect_url: 'https://us02web.zoom.us/webinar/register/WN_11nbTDSPRcm8ZHppThR8iA',
      },
      {
        title: 'Peplink Photo Contest',
        excerpt: 'Explore and show us your creativity for a chance to win',
        image: '/assets/hub/photo_contest_03_v2-1-600x470_cropped.jpg',
        call_to_action: 'Enter Contest',
        redirect_url: `${ROOT_ROUTES.FORUM}/t/speedfusion-contest-2021-tell-us-what-speedfusion-has-done-for-you/33858`,
      },
    ],
  };

  return (
    <section
      id="events"
      className="container px-3 mx-auto my-16 wow fadeInUp"
      data-wow-duration="600ms"
      data-wow-delay="700ms"
    >
      <div className="section-subtitle">{data.title}</div>
      <div className="grid gap-12 lg:grid-cols-2 sm:grid-cols-1">
        {data?.items?.map((item, index) => (
          <Item data={item} key={index} />
        ))}
      </div>
    </section>
  );
};
