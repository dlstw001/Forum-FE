import { toLower } from 'lodash';
import React from 'react';

const questions = {
  'Become Peplink Partners': {
    type: 'response',
    response:
      'To build your business by helping customers get more from their wide area networks while spending less. Our advanced WAN bonding solutions, powered by patented SpeedFusion technology, give customers blazing speed and seamless connectivity at big savings compared to MPLS and other legacy technologies.',
  },
  'warranty renewal': {
    title: 'What would you like to renew?',
    type: 'options',
    options: [{ title: 'Velocity' }, { title: 'Blue Chip', disabled: true }],
  },
  xxx: {
    title: 'What would you like to renew?',
    type: 'options',
    options: [{ title: 'Velocity' }, { title: 'Blue Chip', disabled: true }],
  },
  Hardware: {
    type: 'response',
    response: 'If you are an end user, you may contact one of your local certified distributor.',
  },
};

export default ({ data, onAnswer }) => {
  React.useEffect(() => {
    const question = questions[toLower(data.message)];
    if (question) {
      onAnswer({ ...question });
    }
  }, [data, onAnswer]);
  return (
    <li className="flex-row-reverse">
      <span className="avatar-user">LW</span>
      <p className="px-3 py-2 rounded-md bg-primary">{data.message}</p>
    </li>
  );
};
