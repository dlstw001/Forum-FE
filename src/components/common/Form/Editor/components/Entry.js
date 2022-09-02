import React from 'react';

export default (props) => {
  const {
    mention,
    // eslint-disable-next-line no-unused-vars
    searchValue,
    // eslint-disable-next-line no-unused-vars
    isFocused,
    ...rest
  } = props;

  return (
    <div {...rest}>
      <div className="inline-flex items-center p-1 hover:bg-gray-100">
        <img
          alt={mention.avatar || `https://ui-avatars.com/api/?name=${mention?.displayName}`}
          src={mention.avatar || `https://ui-avatars.com/api/?name=${mention?.displayName}`}
          role="presentation"
          className="w-8 h-8 mr-2 border-none rounded-full"
        />
        {mention.displayName}
      </div>
    </div>
  );
};
