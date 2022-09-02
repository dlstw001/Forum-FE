import React from 'react';
import ToogleSwitch from 'components/common/ToggleSwitch';

export default ({ personalMessage, setPersonalMessage }) => {
  return (
    <>
      {personalMessage !== undefined && (
        <div className="mb-8">
          <h4 className="summary-subtitle">Messages preference</h4>
          <div className="flex">
            <span>Allow other users to send me private messages</span>
            <div className="ml-auto">
              <ToogleSwitch
                id={'personalMessage'}
                name={'personalMessage'}
                checked={personalMessage}
                onChange={(value) => setPersonalMessage(value)}
                data-cy="personal_message"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
