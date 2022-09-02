import Message from './Message';
import Question from './Question';
import React from 'react';
import Response from './Response';
import Select from './Select';

export default (props) => {
  switch (props.data.type) {
    case 'options':
      return <Question {...props} isSelected={props.data.isSelected} />;
    case 'select':
      return <Select {...props} />;
    case 'response':
      return <Response {...props} />;
    default:
      return <Message {...props} />;
  }
};
