import React from 'react';

export default ({ content, ref, onClick }) => {
  React.useEffect(() => {
    const { current } = ref;

    setTimeout(() => {
      current.querySelectorAll('.mention').forEach((i) => i.addEventListener('click', onClick));
    });
  }, [content, onClick, ref]);
};
