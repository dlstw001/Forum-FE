import { HEADER_LINKS, ROOT_ROUTES } from 'definitions';
import { Link } from 'react-router-dom';
import Dropdown from '../Dropdown';
import KeyboardShortcutModal from '../modals/KeyboardShortcutModal';
import React from 'react';
import useToggle from 'hooks/useToggle';

export default () => {
  const { handleToggle, toggle } = useToggle({
    shortcutModal: false,
  });

  return (
    <>
      <Dropdown
        placement="bottom-end"
        menuClassname="hamburger-menu"
        className="flex items-center h-full ml-3 lg:hidden"
        menu={() => (
          <>
            <div className="heading">
              <p>Community</p>
            </div>
            <hr />
            <ul>
              {process.env.REACT_APP_ENVIRONMENT === 'forumpeplink' ? (
                <>
                  <li>
                    <Link to={'/'}>Home</Link>
                  </li>
                  <li>
                    <a href={'https://community.peplink.com/'}>Community</a>
                  </li>
                  <li>
                    <Link to={ROOT_ROUTES.CASE}>Cases</Link>
                  </li>
                  <li>
                    <a href={process.env.REACT_APP_DIRECTORY_PAGE}>Discover Partners</a>
                  </li>
                </>
              ) : (
                HEADER_LINKS.child.map((i) => (
                  <li key={i.title}>
                    <Link
                      to={{ pathname: i.link }}
                      target={i.title === 'Discover Partners' ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                    >
                      {i.title}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </>
        )}
      >
        <button className="text-white material-icons md-28 " data-key={'view_hamburger'} data-cy="view_hamburger">
          menu
        </button>
      </Dropdown>
      {toggle.shortcutModal && (
        <KeyboardShortcutModal
          onToggle={(show) => {
            handleToggle({ shortcutModal: show || !toggle.shortcutModal });
          }}
        />
      )}
    </>
  );
};
