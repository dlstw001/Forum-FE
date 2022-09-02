import React from 'react';

const Errors = ({ errors }) => {
  return errors?.length ? (
    <ul className="mb-2 text-danger">
      {errors?.map((i, key) => (
        <li key={key}>{i.message}</li>
      ))}
    </ul>
  ) : (
    <></>
  );
};

export default Errors;
