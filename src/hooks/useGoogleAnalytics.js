import React from 'react';

export default (id) => {
  React.useEffect(() => {
    const script = document.createElement('script');
    if (id) {
      script.src = `//www.googletagmanager.com/gtag/js?id=${id}`;
      script.async = true;
      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          window.dataLayer.push(arguments);
        }
        gtag('js', new Date());

        gtag('config', 'UA-98968-4');
      };
      document.body.appendChild(script);
    }
    return () => {
      if (id) {
        document.body.removeChild(script);
      }
    };
  }, [id]);
};
