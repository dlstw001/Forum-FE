import { get } from 'react-hook-form';
import { isEmpty } from 'lodash';
import React from 'react';

const Container = ({ plain, children }) =>
  plain ? <>{children}</> : <div className="mt-2 text-danger invalid-feedback d-block">{children}</div>;

export default ({ plain = false, methods = {}, name = '' }) => {
  if (isEmpty(methods.errors)) return false;
  const error = get(methods.errors, name);
  if (!error) return false;
  let errorMessage;
  switch (error.type) {
    case 'required':
      errorMessage = `This field is ${error.type}`;
      break;
    default:
      errorMessage = error.message || `This field is invalid`;
  }

  return <Container plain={plain}>{errorMessage}</Container>;
};
