import { isEmpty } from 'lodash';
import cx from 'classnames';
import HtmlParser from 'react-html-parser';
import React from 'react';

export default ({ methods, data }) => {
  const [image, setImage] = React.useState(false);
  const { tags, title, bannerImage, slug } = data;
  const onClickTag = (tag) => methods.setValue('tags', tag);

  React.useEffect(() => {
    var img = new Image();

    img.src = !isEmpty(bannerImage) ? bannerImage : '/assets/forum_img-placeholder.jpg';

    img.onload = function () {
      setImage(this.src);
    };
  }, [bannerImage, title]);

  return (
    <div className="relative mb-4">
      <a
        href={`${process.env.REACT_APP_CUSTOMER_CASES_PAGE}/${slug}`}
        target="_self"
        rel="noopener noreferrer"
        data-cy={`customer_case_${title}`}
      >
        <div
          className={cx('mb-4 customer-case-card', { isLoading: !image })}
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="case-title">{HtmlParser(title)}</div>
      </a>
      <div className="flex flex-wrap">
        {tags?.map((i) => (
          <button className="mb-2 mr-2 tags" key={i._id} onClick={() => onClickTag(i)}>
            {i.name}
          </button>
        ))}
      </div>
    </div>
  );
};
