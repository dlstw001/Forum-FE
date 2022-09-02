import React from 'react';

export default () => {
  return (
    <>
      <footer className="container p-4 mx-auto my-12 mt-auto">
        <div className="mt-12 lg:flex">
          <div className="privacy-policy">
            <a href="https://www.peplink.com/company/privacy/">Privacy Policy</a> |&nbsp;
            <a href="https://www.peplink.com/support/policies/">Terms of Use</a>
          </div>
          <div className="ml-auto copyright">© {new Date().getFullYear()} Peplink | Pepwave. All Rights Reserved.</div>
        </div>
      </footer>
    </>
  );
};
