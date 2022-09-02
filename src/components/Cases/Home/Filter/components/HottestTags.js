import { includes } from 'lodash';
import { inject, observer } from 'mobx-react';
import cx from 'classnames';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

const HottestTags = ({ caseStore, methods, onChange }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [items, setItems] = React.useState({ data: [{ _id: 1, name: 'product' }] });
  const { watch } = methods;
  const tags = watch('tags');

  const onClickTag = (tag) => {
    if (!includes(tags, tag)) {
      methods.setValue('tags', [...(tags || []), tag]);
      onChange();
    }
  };

  React.useEffect(() => {
    caseStore
      .getHottestTags()
      .then((res) => setItems(res))
      .finally(() => setIsLoading(false));
  }, [caseStore]);

  return (
    <div className="hidden md:block">
      <h3 className="sidebar-title">Popular Tags</h3>
      {isLoading && <Skeleton count={8} className="mb-2" />}
      <div>
        {items?.data?.map((i) => (
          <button
            key={i._id}
            className={cx('inline-block mb-2 tags mr-2', { active: tags && tags?.find((j) => j._id === i._id) })}
            onClick={() => onClickTag(i)}
            data-cy={`filter_tag_name_${i.name}`}
          >
            {i.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default inject(({ caseStore }) => ({ caseStore }))(observer(HottestTags));
