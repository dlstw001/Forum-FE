import { getTopicUrl } from 'utils';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import React from 'react';

const RelatedTopicsItem = ({ data }) => {
  return (
    <div className="sidebar-items-row">
      <div className="sidebar-items">
        <Link to={getTopicUrl(data)}>{data.title}</Link>
      </div>
    </div>
  );
};

const RelatedTopicsList = ({ tags, postStore }) => {
  const [relatedByTag, setRelatedByTag] = React.useState({ data: [] });

  const getData = React.useCallback(() => {
    if (tags.length) {
      postStore.relatedByTag({ page: 1, limit: 10, tags: tags }).then((res) => setRelatedByTag(res));
    }
  }, [postStore, tags]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      {!!relatedByTag?.data?.length && (
        <>
          <h3 className="sidebar-title">Related Topics</h3>
          <div className="mb-8 word-break">
            {relatedByTag.data.map((item) => (
              <RelatedTopicsItem key={item._id} data={item} />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default inject(({ postStore }) => ({ postStore }))(observer(RelatedTopicsList));
