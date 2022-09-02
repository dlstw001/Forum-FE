import { HEADER_LINKS } from 'definitions';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import HeaderBar from './HeaderBar';
import React from 'react';
import SearchCases from './SearchCases';
import SearchTopics from './SearchTopics';
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

const Header = ({ history, searchStore, userStore }) => {
  const { toggle, handleToggle } = useToggle({ search: false, showResults: false });
  const inputRef = React.useRef();
  const ref = React.useRef();
  const [value, setValue] = React.useState('');
  const debouncedValue = useDebounce(value);
  const [results, setResults] = React.useState(defaultValue());
  const [user, setUser] = React.useState();
  const [navbarHeight, setNavbarHeight] = React.useState(0);
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
      const header = ref.current.getBoundingClientRect();
      setNavbarHeight(header.top + header.height);
      document.querySelector('body').classList.add('is-search-result');
    } else {
      document.querySelector('body').classList.remove('is-search-result');
    }
  }, [toggle.showResults]);

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
        setResults(res);
        handleToggle({ showResults: true });
      });
    } else {
      setResults(defaultValue());
    }
  }, [debouncedValue, handleToggle, searchStore]);

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

  return (
    <>
      <div className="flex xl:hidden top-bar">
        <div className="container px-3 mx-auto">
          <nav className="text-right">
            {HEADER_LINKS.parent.map((i) => (
              <a href={i.link} key={i.title} target="_blank" rel="noopener noreferrer">
                {i.title}
              </a>
            ))}
          </nav>
        </div>
      </div>
      <header id="mobile" className="sticky top-0 z-50 xl:hidden" ref={ref}>
        <div className="container flex px-3 mx-auto">
          <div className="flex items-center">
            <a href={HEADER_LINKS.child.find((i) => i.title === 'Home').link} target="_self" rel="noopener noreferrer">
              <div className="logo" />
            </a>
          </div>

          <div className="relative flex flex-grow ml-auto text-white search md:py-6 xs:py-5">
            <button
              data-key="search"
              onClick={() => handleToggle({ search: !toggle.search })}
              className="ml-auto material-icons md-28"
            >
              search
            </button>
          </div>
          <HeaderBar user={user} mobile />
        </div>

        {toggle.search && (
          <div className="container mx-auto">
            <div className="relative flex flex-grow py-5 ml-auto text-white search md:py-6">
              <>
                <input
                  onChange={(e) => setValue(e.target.value)}
                  ref={inputRef}
                  type="text"
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
        )}
      </header>
      {toggle.showResults && (
        <div className="container w-screen h-screen mx-auto">
          <div className="search-result" style={{ height: `calc(100vh - ${navbarHeight}px)` }}>
            {!isEmpty && (
              <div className="search-data">
                <SearchTopics results={results} value={value} />
                <SearchCases results={results} value={value} />
              </div>
            )}
            {isEmpty && <h1>No results found.</h1>}
          </div>
        </div>
      )}
    </>
  );
};

export default inject(({ searchStore, userStore }) => ({ searchStore, userStore }))(withRouter(observer(Header)));
