import { getTopicUrl, timeAgoFormat } from 'utils';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

const HottestTopicItem = ({ data }) => (
  <div className="mb-2 sidebar-items">
    <Link to={getTopicUrl(data)}>
      {data.title}
      <div className="text-xs text-gray-400">
        Last Activity: {data.lastModified ? timeAgoFormat(data.lastModified) : timeAgoFormat(data.createdAt)}
      </div>
    </Link>
  </div>
);

const HottestTopicList = ({ postStore }) => {
  const [items, setItems] = React.useState({ data: [] });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    postStore.hot({ limit: 8 }).then((res) => {
      setIsLoading(false);
      setItems(res);
    });
  }, [postStore]);

  return (
    <>
      <h3 className="sidebar-title">Trending Topics</h3>
      {isLoading && <Skeleton count={8} className="mb-2" />}
      <div className="mb-8 word-break">
        {items.data.map((item) => (
          <HottestTopicItem key={item._id} data={item.document} />
        ))}
      </div>
    </>
  );
};

export default inject(({ postStore }) => ({ postStore }))(observer(HottestTopicList));
