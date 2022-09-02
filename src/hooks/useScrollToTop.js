import React from 'react';

export default () => {
  const [hide, setHide] = React.useState(true);

  const handleScroll = () => {
    setHide(document.documentElement.scrollTop < window.screen.height / 2);
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  return {
    scrollToTop,
    hideButton: hide,
  };
};
