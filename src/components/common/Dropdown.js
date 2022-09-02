import { usePopper } from 'react-popper';
import cx from 'classnames';
import React from 'react';
import useClickOutside from 'hooks/useClickOutside';

export default ({
  placement = 'bottom-end',
  children,
  menu: Menu,
  items,
  onClick,
  className,
  menuClassname = 'w-full',
}) => {
  const [visible, setVisibility] = React.useState(false);

  const buttonRef = React.useRef(null);
  const popperRef = React.useRef(null);
  useClickOutside({ onClose: () => setVisibility(false), elemRef: buttonRef });

  const { styles, attributes, update } = usePopper(buttonRef.current, popperRef.current, {
    placement,
  });

  function handleDropdownClick() {
    update();
    setVisibility((prevState) => !prevState);
  }

  const handleClick = (item) => {
    onClick(item);
  };

  return (
    <span className={cx('dropdown', className)} ref={buttonRef} onClick={handleDropdownClick}>
      {children}
      <div
        className={cx('dropdown-menu', menuClassname, { invisible: !visible })}
        ref={popperRef}
        style={styles.popper}
        {...attributes.popper}
      >
        {Menu ? (
          <Menu style={styles.offset} />
        ) : (
          <ul style={styles.offset}>
            {items.map((i, key) => (
              <li key={`${i.value}-${key}`} onClick={() => handleClick(i)} id={i.id}>
                {i.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </span>
  );
};
