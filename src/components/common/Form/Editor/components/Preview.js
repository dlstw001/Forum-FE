import { getHtml } from '..';

import { IMAGE_RESIZE } from 'definitions';
import cx from 'classnames';
import Lightbox from './Lightbox';
import React from 'react';
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';

export default ({ isEditor, data, quoteRef, onImageResize }) => {
  const elRef = React.useRef();

  const content = React.useMemo(() => {
    const transform = (node, index) => {
      if (node.type === 'tag' && node.name === 'img') {
        const { name } = node.parent;
        const shouldIgnore = name === 'a' || node.attribs.class?.indexOf('avatar') > -1;

        return (
          <div className={cx({ resizer: isEditor }, { lightbox: !shouldIgnore })} key={index}>
            {convertNodeToElement(node, index, transform)}

            {isEditor && !shouldIgnore && (
              <div className="resizer-controls">
                {IMAGE_RESIZE.map((i, key) => (
                  <button type="button" key={key} onClick={(e) => onImageResize({ el: e, size: i })}>{`${i}%`}</button>
                ))}
              </div>
            )}
          </div>
        );
      }

      return;
    };
    if (!data) return false;
    return ReactHtmlParser(getHtml(data), { transform });
  }, [data, isEditor, onImageResize]);

  React.useEffect(() => {
    setTimeout(() => {
      if (quoteRef?.current) {
        quoteRef.current.querySelectorAll('img').forEach((i) => {
          i.onerror = () => {
            const el = document.createElement('i');
            el.classList.add('material-icons');
            el.innerText = 'broken_image';
            i.replaceWith(el);
          };
        });
      }
    });
  }, [quoteRef]);

  React.useEffect(() => {
    setTimeout(() => {
      if (isEditor && content) {
        elRef.current &&
          elRef.current.querySelectorAll('.resizer img').forEach((i) => {
            i.onload = () => {
              if (!i.attributes.width && !i.attributes.height) {
                i.setAttribute('width', i.width);
                i.setAttribute('height', i.height);
              }
            };
          });
      }
    });
  }, [content, isEditor]);

  return (
    <div className="break-words preview-content" ref={quoteRef}>
      <Lightbox isEditor={isEditor}>
        <div ref={elRef}>{content}</div>
      </Lightbox>
    </div>
  );
};
