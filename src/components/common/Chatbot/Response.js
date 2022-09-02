import React from 'react';

export default ({ conversation, data, onReset, onPrevious }) => {
  return (
    <li>
      <span className="avatar avatar-tim">
        <i className="icon-chatbot"></i>
      </span>
      <div>
        <div className="px-3 py-2 mb-4 bg-white">
          <p>{data.response}</p>
          <a
            href="https://www.peplink.com/partners/peplink-certified-partner-program/"
            className="block mb-2 text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
          <a
            href="https://access.peplink.com/secure/channel-application.html"
            className="block text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sign up as Peplink Partner
          </a>
        </div>
        <div className="nav-actions">
          {conversation.length > 3 && <button onClick={onPrevious}>Back to Previous</button>}
          <button onClick={onReset}>Back to Main</button>
        </div>
      </div>
    </li>
  );
};
