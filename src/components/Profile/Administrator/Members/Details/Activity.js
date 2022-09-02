import { inject, observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import { Link, useParams } from 'react-router-dom';
import { removeEmpty } from 'utils';
import { ROUTES } from 'definitions';
import { useHistory } from 'react-router';
import ActivityCard from 'components/Profile/User/Activity/ActivityCard';
import cx from 'classnames';
import React from 'react';

const TABS = [
  { value: 'post', label: 'Post' },
  { value: 'like', label: 'Like' },
  { value: 'reply', label: 'Reply' },
  { value: 'topicViewed', label: 'Topic viewed' },
];

const Activity = ({ userStore }) => {
  const params = useParams();
  const history = useHistory();
  const { displayName, section } = params;
  const [items, setItems] = React.useState({ data: [] });
  const [isBottom, setIsBottom] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [filters, setFilters] = React.useState({
    pageSize: 10,
    pageIndex: 1,
  });
  const [selectedSection, setSelectedSection] = React.useState(section);

  const getData = React.useCallback(async () => {
    setIsLoading(true);
    const payload = { page: filters.pageIndex, limit: filters.pageSize };

    const apiEndpoint =
      selectedSection === 'post'
        ? userStore.post
        : selectedSection === 'like'
        ? userStore.like
        : selectedSection === 'reply'
        ? userStore.reply
        : selectedSection === 'topicViewed'
        ? userStore.replyViewed
        : userStore.find;

    apiEndpoint(displayName, removeEmpty(payload)).then((res) => {
      setItems((prevState) => {
        const { data, ...rest } = prevState;

        if (payload.page > 1) {
          return {
            ...rest,
            ...res,
            data: [
              ...data,
              ...res.data.map((i) => ({
                ...i.document,
                ...i,
              })),
            ],
          };
        } else {
          return res;
        }
      });
      setIsLoading(false);
    });
  }, [
    displayName,
    filters.pageIndex,
    filters.pageSize,
    selectedSection,
    userStore.find,
    userStore.like,
    userStore.post,
    userStore.reply,
    userStore.replyViewed,
  ]);

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
    getData();
  }, [getData]);

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

  React.useEffect(() => {
    if (isEmpty(params.section)) {
      history.push(`${ROUTES.USERS}/${displayName}/activity/post`);
    }
  }, [displayName, history, params.section]);

  React.useEffect(() => {
    setSelectedSection(params.section);
    setFilters((prevState) => ({ ...prevState, pageIndex: 1 }));
  }, [params.section]);

  return (
    <>
      <div className="flex">
        <div className="w-1/6">
          <ul>
            {TABS.map((tab) => (
              <li key={tab.value} className="mb-2">
                <Link
                  to={`${ROUTES.USERS}/${displayName}/activity/${tab.value}`}
                  className={cx('anchor font-semibold text-xl', { 'text-primary': tab.value === section })}
                >
                  {tab.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-5/6">
          {items.data.length === 0 && <div className="text-2xl font-semibold">No activity.</div>}
          {items.data.map((item) => (
            <ActivityCard key={item._id} data={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default inject(({ userStore }) => ({ userStore }))(observer(Activity));
