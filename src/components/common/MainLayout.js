import { Route } from 'react-router-dom';
// import Chatbot from './Chatbot';
import Footer from './Footer';
import Header from './Header/Header';
import React from 'react';
import useScrollToTop from 'hooks/useScrollToTop';
import useShortcuts from 'hooks/useShortcuts';

export default ({ component: Component, ...rest }) => {
  const { scrollToTop, hideButton } = useScrollToTop();

  useShortcuts();

  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <>
            <Header />
            <Component {...props} />
            {!hideButton && (
              <div onClick={scrollToTop} className="goto-top material-icons">
                expand_less
              </div>
            )}
            <Footer />
            {/* <Chatbot /> */}
          </>
        );
      }}
    />
  );
};
