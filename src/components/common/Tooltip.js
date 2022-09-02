import cx from 'classnames';
import React from 'react';
import TooltipTrigger from 'react-popper-tooltip';

export default ({ children, tooltip, hideArrow, containerClassName, className, ...props }) => (
  <TooltipTrigger
    {...props}
    tooltip={({ arrowRef, tooltipRef, getArrowProps, getTooltipProps, placement }) => (
      <div
        {...getTooltipProps({
          ref: tooltipRef,
          className: containerClassName || 'tooltip-container',
        })}
      >
        {!hideArrow && (
          <div
            {...getArrowProps({
              ref: arrowRef,
              className: 'tooltip-arrow',
              'data-placement': placement,
            })}
          />
        )}
        {tooltip}
      </div>
    )}
  >
    {({ getTriggerProps, triggerRef }) => (
      <span
        {...getTriggerProps({
          ref: triggerRef,
          className: cx('trigger', className),
        })}
      >
        {children}
      </span>
    )}
  </TooltipTrigger>
);
