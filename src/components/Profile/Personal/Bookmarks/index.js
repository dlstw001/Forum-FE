import { inject, observer } from 'mobx-react';
import Breadcrumb from 'components/common/Breadcrumb';
import DashboardSectionList from '../../DashboardSectionList';
import FollowingItem from './BookmarkCard';
import Loading from 'components/common/Loading';
import MobileMenu from 'components/Profile/MobileMenu';
import React from 'react';

const Following = ({ postStore }) => {
  const [items, setItems] = React.useState({ data: [] });
  const [isBottom, setIsBottom] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [filters, setFilters] = React.useState({
    pageSize: 10,
    pageIndex: 1,
  });

  const getData = React.useCallback(async () => {
    setIsLoading(true);
    const payload = {
      page: filters.pageIndex,
      limit: filters.pageSize,
    };

    await postStore.myBookmarkList(payload).then((res) => {
      setItems((prevState) => {
        const { data, ...rest } = prevState;

        return {
          ...rest,
          ...res,
          data: [...data, ...res.data],
        };
      });
      setIsLoading(false);
    });
  }, [postStore, filters.pageIndex, filters.pageSize]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  const fetchData = React.useCallback((options) => {
    setFilters((prevState) => ({ ...prevState, ...options }));
  }, []);

  const isScrolling = () => {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    if (scrollTop + window.innerHeight + 50 < scrollHeight) {
      setIsBottom(false);
    } else {
      setIsBottom(true);
    }
  };

  React.useEffect(() => {
    window.addEventListener('scroll', isScrolling);
    return () => window.removeEventListener('scroll', isScrolling);
  }, []);

  React.useEffect(() => {
    if (isBottom && items.total_page >= filters.pageIndex && !isLoading) {
      setIsBottom(false);
      fetchData({ pageIndex: filters.pageIndex + 1 });
    }
  }, [fetchData, filters.pageIndex, isBottom, items.total_page, isLoading]);

  const handleUnfollow = async (item) => {
    await postStore.removeBookmark(item._id);
    setFilters({ pageIndex: 1, pageSize: 10 });
    setItems({ data: [] });
    getData();
  };

  return (
    <>
      <main className="container wrapper lg:flex">
        <DashboardSectionList className="hidden lg:block" isPersonal={true} />
        <div className="w-full">
          <Breadcrumb title={`Bookmarks`} className="mb-8" />
          <MobileMenu title="Bookmarks" isPersonal={true} />
          {items.data.map((item) => (
            <FollowingItem key={item._id} data={item} handleUnfollow={() => handleUnfollow(item)} />
          ))}
          {items?.data?.length < 1 && !isLoading && <h1>No Bookmarks Available</h1>}
          {isLoading && <Loading />}
        </div>
      </main>
    </>
  );
};

export default inject(({ postStore }) => ({ postStore }))(observer(Following));
