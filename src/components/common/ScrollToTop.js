import { withRouter } from 'react-router-dom';
import React from 'react';

const ScrollToTop = ({ history }) => {
  React.useEffect(() => {
    const unlisten = history.listen(() => window.scrollTo(0, 0));
    return () => unlisten();
  }, [history]);

  return null;
};

export default withRouter(ScrollToTop);
