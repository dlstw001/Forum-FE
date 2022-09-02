import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

const HottestTagItem = ({ data }) => {
  return (
    <div className="inline-block mb-3 sidebar-items">
      <Link className="mr-2 tags" to={`${ROUTES.TOPIC}?tab=findByTag&tag=${data.name}`}>
        {data.name}
      </Link>
    </div>
  );
};

const HottestTagList = ({ categoryStore, id = null }) => {
  const [trend, setTrend] = React.useState({ data: [] });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (id) {
      setIsLoading(true);
      categoryStore.tags(id, { limit: 10 }).then((res) => {
        setIsLoading(false);
        setTrend(res);
      });
    }
  }, [categoryStore, id]);

  return (
    <>
      <h3 className="sidebar-title">Popular Tags</h3>
      {isLoading && <Skeleton count={8} className="mb-2" />}
      <div className="mb-8 word-break">
        {trend.data.map((item) => (
          <HottestTagItem key={item.tag._id} data={item.tag} />
        ))}
      </div>
    </>
  );
};

export default inject(({ categoryStore }) => ({ categoryStore }))(observer(HottestTagList));
