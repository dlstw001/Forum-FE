import { Preview } from 'components/common/Form/Editor';
import cx from 'classnames';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

export const TEMPLATE_TYPE = {
  DOWNLOAD: 'download',
  QUOTE: 'quote',
  PREVIEW: 'preview',
};

const preview = (item) => {
  const { hostname, title, image, link, desc } = item;

  return (
    <div className="block p-4 my-4 border-2 url-preview">
      <div className="mb-2 text-sm text-gray-500">{hostname}</div>
      <div className="overflow-auto url-preview-content">
        {image && <img alt="preview" className="float-left w-48 mr-4" src={image} />}
        <a href={link} className="block mb-1 text-lg font-bold" rel="noopener noreferrer" target="_blank">
          {title}
        </a>
        {desc}
      </div>
    </div>
  );
};

const download = ({ item, size, icon, hostname, filename }) => {
  return (
    <div className="block p-4 my-4 border-2 download-preview">
      <div className="mb-2 text-sm text-gray-500">{hostname}</div>
      <span className="flex">
        <span className="block mr-2">
          <i className={cx('icon', `icon-file-${icon}`)}></i>
        </span>
        <span className="block">
          <a href={item} rel="noopener noreferrer" target="_blank">
            {filename}
          </a>
        </span>
      </span>
      <span className="block text-sm text-gray-500">{size}</span>
    </div>
  );
};

const quote = ({ groups, child }) => {
  return (
    <div className={cx('quote', { 'py-2': !child })}>
      {groups.name && (
        <span className="flex items-center mb-4">
          <span className="flex items-center">
            <img
              src={`https://ui-avatars.com/api/?name=${groups.name.replace(/\s/g, '+')}`}
              alt={groups.name}
              className="w-6 h-6 mr-2 rounded-full cursor-default pointer-events-none avatar"
            />
            {groups.name}
          </span>
          :
        </span>
      )}
      <div className="quote-content">
        <Preview data={groups.quote} />
        {/* {encodeURIComponent(groups.quote)} */}
      </div>
    </div>
  );
};

export default (type, props) => {
  let template;

  switch (type) {
    case TEMPLATE_TYPE.DOWNLOAD:
      template = download(props);
      break;
    case TEMPLATE_TYPE.QUOTE:
      template = quote(props);
      break;
    case TEMPLATE_TYPE.PREVIEW:
      template = preview(props);
      break;
    default:
      break;
  }
  return ReactDOMServer.renderToStaticMarkup(template);
};
