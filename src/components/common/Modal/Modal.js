import { createPortal } from 'react-dom';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import cx from 'classnames';
import React from 'react';
import usePortal from 'hooks/usePortal';

export default ({ id = 'modal', children, onToggle, size = 'md', className, containerClass }) => {
  const ref = React.createRef();
  const target = usePortal(id);

  React.useEffect(() => {
    const { current } = ref;
    disableBodyScroll(current);
    return () => {
      enableBodyScroll(current);
    };
  }, [ref]);

  return createPortal(
    <div ref={ref} className={cx('modal', className)}>
      <div
        className={cx(
          'relative w-auto modal-content ',
          containerClass,
          `modal-${size}`,
          { 'md:w-1/3 lg:w-1/5': size === 'xs' },
          { 'md:w-2/3 lg:w-1/3': size === 'sm' },
          { 'md:w-3/4 lg:w-2/4': size === 'md' },
          { 'md:w-4/5': size === 'lg' },
          { container: size === 'full' }
        )}
      >
        {children}
      </div>
      <div className="modal-overlay" onClick={() => onToggle && onToggle(false)} />
    </div>,
    target
  );
};
