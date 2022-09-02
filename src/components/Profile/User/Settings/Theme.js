import React from 'react';

export default ({ theme, setTheme, methods }) => {
  return (
    <>
      <div className="pb-8">
        <h4 className="summary-subtitle">Theme [Dont have it now]</h4>
        <div className="flex">
          <label className="flex items-center mr-2">
            <input
              type="radio"
              name="theme"
              className="mr-2"
              methods={methods}
              value="light"
              checked={theme === 'light'}
              onChange={() => setTheme('light')}
            />
            <span>Light Mode</span>
          </label>
          <label className="flex items-center ">
            <input
              type="radio"
              name="theme"
              className="mr-2"
              methods={methods}
              value="dark"
              checked={theme === 'dark'}
              onChange={() => setTheme('dark')}
            />
            <span>Dark Mode</span>
          </label>
        </div>
      </div>
    </>
  );
};
