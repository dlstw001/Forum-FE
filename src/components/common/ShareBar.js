import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';
import { inject, observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import React from 'react';

const ShareBar = ({ userStore, url, title, hashtag }) => {
  const httpUrl =
    process.env.REACT_APP_ENVIRONMENT === 'production' || process.env.REACT_APP_ENVIRONMENT === 'staging'
      ? `https://${url}`
      : `http://${url}`;
  const isLoggedIn = !isEmpty(userStore?.user);
  const shareUrl = isLoggedIn ? httpUrl + `?u=${userStore.user.displayName}` : httpUrl;

  const copyToClipboard = () => {
    const dummy = document.createElement('input');
    document.body.appendChild(dummy);
    dummy.value = shareUrl;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  };

  return (
    <>
      <div className="flex items-center p-2 rounded">
        <FacebookShareButton className="share-button" url={shareUrl} quote={title} hashtag={hashtag}>
          <FacebookIcon size={24} round={true} />
        </FacebookShareButton>
        <EmailShareButton className="ml-2 share-button" subject={title} url={shareUrl}>
          <EmailIcon size={24} round={true} />
        </EmailShareButton>
        <TwitterShareButton className="ml-2 share-button" url={shareUrl} hashtag={hashtag}>
          <TwitterIcon size={24} round={true} />
        </TwitterShareButton>
        <WhatsappShareButton className="ml-2 share-button" url={shareUrl}>
          <WhatsappIcon size={24} round={true} />
        </WhatsappShareButton>
        <button className="ml-2 font-semibold share-button" onClick={copyToClipboard} title="Copy link to clipboard">
          <i className="mr-1 text-white border-white rounded-full md-16 material-icons">link</i>
        </button>
      </div>
    </>
  );
};

export default inject(({ userStore }) => ({ userStore }))(observer(ShareBar));
