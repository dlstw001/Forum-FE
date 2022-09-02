import React from 'react';
import useToggle from 'hooks/useToggle';

export const TourContext = React.createContext(null);

export const TourProvider = ({ children }) => {
  const { toggle, handleToggle } = useToggle({ tour: false });
  return (
    <TourContext.Provider
      value={{ show: toggle.tour, setShow: (show) => handleToggle({ tour: show || !toggle.tour }) }}
    >
      {children}
    </TourContext.Provider>
  );
};
