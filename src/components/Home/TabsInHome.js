import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import { useHistory } from 'react-router-dom';
import { usePopper } from 'react-popper';
import cx from 'classnames';
import React from 'react';
import Select from 'components/common/Form/Select';

export default ({ current, onClick, tabs = [], children, containerClassName, className, tagList }) => {
  const history = useHistory();
  const [visible, setVisibility] = React.useState(false);

  const buttonRef = React.useRef(null);
  const popperRef = React.useRef(null);

  const { styles } = usePopper(buttonRef.current, popperRef.current, {
    placement: 'bottom-start',
  });

  const handleDropdownClick = () => setVisibility((prevState) => !prevState);

  const onHandleClickTag = (value) => {
    onClick(value);
    setVisibility(false);
  };

  return (
    <>
      <ul
        className={cx('flex-wrap items-center flex-grow mb-4 tab-menu', containerClassName)}
        data-tut="sorting-topics"
      >
        {tabs.map((tab) => (
          <li key={tab.value}>
            <Link
              className={cx('anchor', className, { active: current === tab.value })}
              onClick={() => onHandleClickTag(tab.value)}
              data-cy={tab['data-cy']}
              disabled={current === tab.value}
              to={(location) => `${location.pathname}?tab=${tab.value}`}
            >
              {tab.label}
            </Link>
          </li>
        ))}
        <li>
          <button className={cx(className)}>
            <Link to={ROUTES.CATEGORIES}>Categories</Link>
          </button>
        </li>
        <li className="lg:w-64">
          <button className={cx(className)} ref={buttonRef} onClick={handleDropdownClick} data-cy="homepage_tags">
            Tags <i className="material-icons"> {visible ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
          </button>
          <div ref={popperRef} style={styles.offset} className={cx('dropdown relative w-full', { hidden: !visible })}>
            <Select
              name="tags"
              options={tagList}
              getOptionValue={(option) => option._id}
              getOptionLabel={(option) => option.name}
              className="home-tags-selector"
              isClearable={false}
              components={{
                DropdownIndicator: null,
              }}
              plain={true}
              placeholder="Search"
              onChange={(_, tag) => history.push(`${ROUTES.TOPIC}?tab=findByTag&tag=${tag.name}`)}
            />
            <i className="absolute top-0 right-0 mt-2 mr-2 material-icons">search</i>
          </div>
        </li>
      </ul>
      {children}
    </>
  );
};
