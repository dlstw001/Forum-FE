import React from 'react';
import ToogleSwitch from 'components/common/ToggleSwitch';

export default ({ emailSettings, setEmailSettings }) => {
  const handleToogle = (type, value) => {
    const newObj = { ...emailSettings, [type]: value };
    setEmailSettings(newObj);
  };

  return (
    <>
      <div className="pb-8">
        <h4 className="summary-subtitle">Email</h4>
        <div className="flex mb-2">
          <span>Send me an email when someone messages me [Dont have it now]</span>
          <div className="ml-auto">
            <ToogleSwitch
              id={'message'}
              name={'message'}
              checked={emailSettings.message}
              onChange={(value) => handleToogle('message', value)}
            />
          </div>
        </div>
        <div className="flex">
          <span>
            Send me an email when someone quotes me, replies to my post, mentions my @username, or invites me to a topic
          </span>
          <div className="ml-auto">
            <ToogleSwitch
              id={'qrmi'}
              name={'qrmi'}
              checked={emailSettings.qrmi}
              onChange={(value) => handleToogle('qrmi', value)}
            />
          </div>
        </div>
      </div>
    </>
  );
};
