import { isEmpty } from 'lodash';
import React from 'react';

export default ({ enabled }) => {
  React.useEffect(() => {
    const userData = localStorage.getItem(process.env.REACT_APP_APP_NAME);
    const user = !isEmpty(userData) ? JSON.parse(userData) : {};
    const script = document.createElement('script');

    if (enabled) {
      window.markerConfig = {
        destination: process.env.REACT_APP_MARKER_IO,
        ...(!isEmpty(user) && {
          reporter: {
            email: user.email,
            fullName: user.name,
          },
        }),
      };

      script.src = `//edge.marker.io/latest/shim.js`;
      script.async = true;
      document.body.appendChild(script);
    }
    return () => {
      if (enabled) {
        document.body.removeChild(script);
      }
    };
  }, [enabled]);
};
