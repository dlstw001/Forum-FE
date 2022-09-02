import { defaultItems } from 'stores/post';
import { HEADER_LINKS } from 'definitions';
import { inject, observer } from 'mobx-react';
import { Link, useHistory } from 'react-router-dom';
import { ROUTES } from 'definitions';
import { withRouter } from 'react-router-dom';
import CategoryLine from '../CategoryLine';
import cx from 'classnames';
import HeaderBar from './HeaderBar';
import React from 'react';
import SearchCases from './SearchCases';
import SearchCategories from './SearchCategories';
import SearchTags from './SearchTags';
import SearchTopics from './SearchTopics';
import SearchUsers from './SearchUsers';
import useClickOutside from 'hooks/useClickOutside';
import useDebounce from 'hooks/useDebounce';
import useToggle from 'hooks/useToggle';

const defaultValue = () => ({
  categories: { data: [] },
  posts: { data: [] },
  tags: { data: [] },
  users: { data: [] },
  cases: { data: [] },
});

const Header = ({ searchStore, userStore, match, postStore }) => {
  const history = useHistory();

  const { toggle, handleToggle } = useToggle({ search: false, showResults: false });
  const inputRef = React.useRef();
  const mobileInputRef = React.useRef();
  const ref = React.useRef();
  const containerRef = React.useRef();
  const [value, setValue] = React.useState('');
  const debouncedValue = useDebounce(value);
  const [results, setResults] = React.useState(defaultValue());
  const [user, setUser] = React.useState();
  const [showTopicInfo, setShowTopicInfo] = React.useState(false);
  const [postData, setPostData] = React.useState();
  const [navbarHeight, setNavbarHeight] = React.useState(0);
  const [navbarTop, setNavbarTop] = React.useState(0);
  const [containerBounds, setContainerBounds] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  useClickOutside({ onClose: () => handleToggle({ search: false, showResults: false }), elemRef: ref });

  React.useEffect(() => {
    const unlisten = history.listen(() => {
      handleToggle({ search: false, showResults: false });
    });

    return () => {
      unlisten();
    };
  }, [history, handleToggle]);

  React.useEffect(() => {
    const keypress = (e) => {
      if (toggle.search && e.keyCode === 27) {
        handleToggle({ search: false, showResults: false });
      }
    };
    document.addEventListener('keydown', keypress, false);
    return () => document.removeEventListener('keydown', keypress);
  });

  React.useEffect(() => {
    if (toggle.showResults) {
      const { top, height } = ref.current.getBoundingClientRect();

      setNavbarHeight(top + height);
      setNavbarTop(top);
      document.querySelector('body').classList.add('is-search-result');
    } else {
      document.querySelector('body').classList.remove('is-search-result');
    }
  }, [toggle.showResults]);

  React.useEffect(() => {}, []);

  React.useEffect(() => {
    if (toggle.search) {
      inputRef.current.focus();
    } else {
      setValue('');
    }
  }, [toggle.search]);

  React.useEffect(() => {
    if (debouncedValue.length > 2) {
      searchStore.find({ term: debouncedValue, limit: 3 }).then((res) => {
        setResults({
          ...res,
          categories: {
            ...res.categories,
            data: res.categories.data.map((i) => ({ ...i, parent: undefined })),
          },
        });
        handleToggle({ showResults: true });
        setIsLoading(false);
      });
    } else {
      setResults(defaultValue());
    }
  }, [debouncedValue, handleToggle, searchStore]);

  const handleScroll = () => {
    const { top, height } = ref.current.getBoundingClientRect();

    setNavbarHeight(top + height);
    setNavbarTop(top);
    setShowTopicInfo(top === 0);
  };

  const onResize = () => {
    const container = containerRef.current.getBoundingClientRect();

    setContainerBounds(container);
  };

  React.useEffect(() => {
    handleScroll();
    onResize();
  }, []);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', onResize, true);
    window.addEventListener('resize', handleScroll, true);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', onResize, true);
      window.removeEventListener('resize', handleScroll, true);
    };
  }, []);

  const isEmpty = React.useMemo(() => {
    return (
      results.categories.data.length === 0 &&
      results.posts.data.length === 0 &&
      results.tags.data.length === 0 &&
      results.users.data.length === 0 &&
      results.cases.data.length === 0
    );
  }, [results]);

  React.useEffect(() => {
    setUser(userStore.user);
  }, [userStore.user]);

  React.useEffect(() => {
    if (postStore.data.item) {
      setPostData(postStore.data.item);
    }
  }, [postStore.data]);

  const handleCTR = async (i) => {
    await searchStore.createCTR(i);
  };

  const onClickSearchButton = async () => {
    await handleToggle({ search: true });

    if (ref.current.clientWidth >= 1024) {
      inputRef.current.focus();
    } else {
      mobileInputRef.current.focus();
    }
  };

  const searchAction = (event) => {
    const { charCode } = event;

    setIsLoading(true);

    if (value?.length > 0 && charCode === 13) {
      handleToggle({ search: false });
      history.push(`${ROUTES.SEARCH}?term=${value}`);
    }
  };

  const handleClick = (e) => {
    postStore.items = defaultItems();
    postStore.filters = { pageIndex: 1, pageSize: 10 };
    if (history.location.pathname === '/') {
      e.preventDefault();
      postStore.getData();
    }
  };
  return (
    <>
      <div className="flex top-bar">
        <div className="container px-3 mx-auto">
          <nav className="text-right">
            {HEADER_LINKS.parent.map((i) => (
              <Link
                to={{ pathname: i.link }}
                key={i.title}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                {i.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <header className="sticky top-0 z-50 xl:flex" ref={ref}>
        <div className={cx('container px-3 mx-auto flex container-ref')} ref={containerRef}>
          <div className={cx('flex items-center', { 'lg:hidden': toggle.search })}>
            <Link to="/" onClick={handleClick}>
              <div className="logo" />
            </Link>
            {match.path === `${ROUTES.TOPIC}/:slug/:id?` && showTopicInfo && postData && (
              <div className="hidden ml-2 text-white lg:ml-32 md:block">
                <h2 className="font-semibold subheader-topic-title">{postData.title}</h2>
                {postData.category && (
                  <CategoryLine category={postData.category} hasChild={postData.categoryHasChild} />
                )}
              </div>
            )}
          </div>

          <div
            className={cx('relative flex ml-auto text-white search md:py-6 xs:py-5', { 'lg:flex-grow': toggle.search })}
          >
            <div className={cx('items-center ml-auto font-medium hidden lg:flex', { 'lg:hidden': toggle.search })}>
              {HEADER_LINKS.child.map((i) =>
                i.external ? (
                  <a target={i.target} href={i.link} key={i.title} className="mx-4 leading-none">
                    {i.title}
                  </a>
                ) : (
                  <Link to={{ pathname: i.link }} key={i.title} className="mx-4 leading-none">
                    {i.title}
                  </Link>
                )
              )}
            </div>
            <button
              data-key="search"
              onClick={onClickSearchButton}
              className={cx('material-icons md-28', { 'ml-16': !toggle.search })}
              data-cy="search_bar"
            >
              search
            </button>
            <div className={cx('hidden w-full', { 'lg:block': toggle.search })}>
              <input
                onKeyPress={searchAction}
                onChange={(e) => setValue(e.target.value)}
                value={value}
                ref={inputRef}
                type="text"
                className="input-search-text"
                data-cy="search_input_value desktop"
              />
              <button
                onClick={() => handleToggle({ search: false, showResults: false })}
                className="absolute top-0 right-0 h-full material-icons"
              >
                close
              </button>
            </div>
          </div>
          <HeaderBar user={user} />
        </div>
        <div className={cx('container mx-auto lg:hidden', { hidden: !toggle.search })}>
          <div className="relative flex flex-grow py-5 ml-auto text-white search md:py-6">
            <>
              <input
                onKeyPress={searchAction}
                onChange={(e) => setValue(e.target.value)}
                ref={mobileInputRef}
                type="text"
                value={value}
                placeholder="Search..."
                className="input-search-text"
              />
              <button
                onClick={() => handleToggle({ search: false, showResults: false })}
                className="absolute top-0 right-0 h-full material-icons"
              >
                close
              </button>
            </>
          </div>
        </div>
      </header>
      {toggle.showResults && value?.length > 2 && !isLoading && (
        <div
          className="search-result"
          style={{
            top: navbarTop === 0 ? navbarHeight : navbarHeight + navbarTop - 32,
            width: containerBounds.width,
            left: containerBounds.x,
          }}
        >
          <div className="container w-screen h-screen mx-auto contents">
            {!isEmpty && (
              <div className="flex items-start justify-between">
                <div className="border-gray-200 border-solid lg:border-r lg:w-3/4 lg:pr-8 lg:mr-8">
                  <SearchTopics results={results} value={value} handleCTR={(_id) => handleCTR(_id)} />
                  <SearchCases results={results} value={value} />
                  <SearchTags results={results} handleCTR={(_id) => handleCTR(_id)} />
                </div>
                <div className="hidden w-1/4 lg:block side-results">
                  <SearchCategories results={results} handleCTR={(_id) => handleCTR(_id)} />
                  <SearchUsers results={results} handleCTR={(_id) => handleCTR(_id)} />
                </div>
              </div>
            )}
            {isEmpty && value?.length > 2 && <h1>No results found.</h1>}
          </div>
        </div>
      )}
    </>
  );
};

export default inject(({ searchStore, userStore, postStore }) => ({ searchStore, userStore, postStore }))(
  withRouter(observer(Header))
);
