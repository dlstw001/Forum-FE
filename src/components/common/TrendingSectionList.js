import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

const TrendingSectionItem = ({ data }) => {
  return (
    <div className="flex items-center mb-2 sidebar">
      {/*<img
        className="w-10 h-10 mr-4"
        src={
          data.image
            ? `${process.env.REACT_APP_API_SERVER}/category/image/${data.image?.filename}`
            : '/assets/forum_img-placeholder.jpg'
        }
        alt=""
      />*/}
      <div className="sidebar-items">
        {data.read_restricted && <i className="material-icons md-16 archived">lock</i>}
        <Link to={`${ROUTES.CATEGORY_DETAILS}/${data.slug}`}>{data.name}</Link>
      </div>
    </div>
  );
};

const TrendingSectionList = ({ categoryStore }) => {
  const [trend, setTrend] = React.useState({ data: [] });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    categoryStore.trend({ limit: 8 }).then((res) => {
      setIsLoading(false);
      setTrend(res);
    });
  }, [categoryStore]);

  return (
    <>
      <h3 className="sidebar-title">Popular Categories</h3>
      {isLoading && <Skeleton count={8} className="mb-2" />}
      <div className="mb-8 word-break">
        {trend.data.map((item) => (
          <TrendingSectionItem key={item._id} data={{ ...item.document, hasChild: item.hasChild, _id: item._id }} />
        ))}
      </div>
    </>
  );
};

export default inject(({ categoryStore }) => ({ categoryStore }))(observer(TrendingSectionList));
