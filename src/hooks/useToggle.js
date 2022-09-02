import React from 'react';

export default (state) => {
  const [toggle, setToggle] = React.useState(state);
  const handleToggle = React.useCallback((item) => {
    setToggle((prevState) => ({ ...prevState, ...item }));
  }, []);

  return {
    handleToggle,
    toggle,
  };
};
