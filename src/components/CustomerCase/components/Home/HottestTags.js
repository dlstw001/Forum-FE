import { inject, observer } from 'mobx-react';
import cx from 'classnames';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

const HottestTags = ({ customerCaseStore, methods }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const { watch } = methods;
  const selectedTag = watch('tags') || {};
  const [tags, setTags] = React.useState([]);
  const onClickTag = (tag) => methods.setValue('tags', tag);

  React.useEffect(() => {
    customerCaseStore
      .getHottestTags()
      .then((res) => setTags(res))
      .finally(() => setIsLoading(false));
  }, [customerCaseStore]);

  return (
    <div className="hidden md:block">
      <h3 className="sidebar-title">Popular Tags</h3>
      {isLoading && <Skeleton count={8} className="mb-2" />}
      <div>
        {tags?.map((tag) => (
          <button
            key={tag.id}
            className={cx('inline-block mb-2 tags mr-2', { active: selectedTag?.id === tag?.id })}
            onClick={() => onClickTag(tag)}
            data-cy={`filter_tag_name_${tag.name}`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default inject(({ customerCaseStore }) => ({
  customerCaseStore,
}))(observer(HottestTags));
