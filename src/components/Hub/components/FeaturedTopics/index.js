import { ROOT_ROUTES } from 'definitions';
import Item from './Item';
import React from 'react';

export default () => {
  const data = {
    title: 'Stay up to date with the Latest',
    items: [
      {
        id: 670,
        image: '/assets/hub/Public_Safety-640x480.jpg',
        title: 'Latest Press Release Articles',
        excerpt:
          '<p>Building An Unbreakable Arial Public Safety Network.</p><p>Learn how Kymeta integrated Peplink into their solution to enable seamless, always-on broadband connectivity in our latest press release. </p>',
        redirect_url: `${ROOT_ROUTES.FORUM}/t/speedfusion-with-at-t-firstnet-megarange-keeps-public-safety-well-connected-and-enables-unmatched-situational-awareness`,
        call_to_action: 'Learn More',
        youtube_url: '',
        type: 'Press Release',
      },
      {
        id: 671,
        image: '/assets/hub/SPC-640x480.jpg',
        title: 'Achieve the impossible with SpeedFusion Cloud',
        excerpt:
          '<p>From video streaming to online collaborations, everything depends on consistent internet. Check out how SpeedFusion Cloud can help you achieve just that! </p>',
        redirect_url: 'https://sfc.peplink.com',
        call_to_action: 'Discover More',
        youtube_url: '',
        type: 'SpeedFusion Cloud',
      },
      {
        id: 673,
        image: '/assets/hub/Youtube-640x480.jpg',
        title: 'Our YouTube channel just got better!',
        excerpt:
          '<p>We\u2019ve revamped our Youtube channel!<br /> Like, Comment, and Subscribe to stay updated with our latest videos!</p>',
        redirect_url: 'https://www.youtube.com/c/peplink/featured',
        call_to_action: 'Watch Now',
        youtube_url: '',
        type: 'Video Testimonials',
      },
      {
        id: 674,
        image: '/assets/hub/Martin-640x480.jpg',
        title: 'Peplink Monthly STAR Community Member',
        excerpt:
          '<p>This month we have Martin.<br />You could be our next community STAR! Keep an eye out for a message!</p>',
        redirect_url: `${ROOT_ROUTES.FORUM}/t/this-months-community-spotlight! `,
        call_to_action: 'Read More',
        youtube_url: '',
        type: 'Peplink Monthly Star Community Member',
      },
    ],
  };

  return (
    <section id="featuring" className="container px-3 mx-auto">
      <div className="mb-16 text-center section-title">{data.title}</div>
      {data?.items?.map((item) => (
        <Item data={item} key={item.id} />
      ))}
    </section>
  );
};
