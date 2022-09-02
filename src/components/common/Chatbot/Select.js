import React from 'react';

const questions = {
  'Become Peplink Partners': {
    type: 'response',
    response:
      'To build your business by helping customers get more from their wide area networks while spending less. Our advanced WAN bonding solutions, powered by patented SpeedFusion technology, give customers blazing speed and seamless connectivity at big savings compared to MPLS and other legacy technologies.',
  },
  Purchase: {
    title: 'What would you like to purchase?',
    type: 'options',
    options: [
      { title: 'Hardware' },
      { title: 'Software', disabled: true },
      { title: 'Software', disabled: true },
      { title: 'Warranty', disabled: true },
      { title: 'License', disabled: true },
      { title: 'InControl', disabled: true },
    ],
  },
  Hardware: {
    type: 'response',
    response: 'If you are an end user, you may contact one of your local certified distributor.',
  },
  Velocity: {
    type: 'response',
    response:
      'During the warranty coverage period, Customer can purchase an EssentialCare for the Velocity Hardware from the Peplink Online Store or via a Peplink Certified Partner. The EssentialCare begins on the day after the original warranty or Essential- Care expiry date.',
  },
};

export default ({ data, onAnswer }) => {
  React.useEffect(() => {
    const question = questions[data.title] || questions['Purchase'];
    onAnswer({ ...question });
  }, [data, onAnswer]);
  return (
    <li className="flex-row-reverse">
      <span className="avatar-user avatar">LW</span>
      <p className="px-3 py-2 rounded-md bg-primary">{data.title}</p>
    </li>
  );
};
