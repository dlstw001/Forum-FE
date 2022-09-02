import 'react-day-picker/lib/style.css';
import { Controller } from 'react-hook-form';
import { DateUtils } from 'react-day-picker';
import { usePopper } from 'react-popper';
import cx from 'classnames';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import InputError from './InputError';
import React from 'react';
import useClickOutside from 'hooks/useClickOutside';

const FORMAT = 'dd-MM-yyyy';

function parseDate(str, format, locale) {
  const parsed = dateFnsParse(str, format, new Date(), { locale });
  if (DateUtils.isDate(parsed)) {
    return parsed;
  }
  return undefined;
}

export function formatDate(date, format = FORMAT, locale) {
  return dateFnsFormat(date, format, { locale });
}

const Container = ({ plain, children, className }) =>
  plain ? <>{children}</> : <div className={cx('form-group form-datepicker', className)}>{children}</div>;

// eslint-disable-next-line no-unused-vars
const OverlayComponent = ({ children, classNames, selectedDay, ...props }) => {
  const [, setVisibility] = React.useState(false);

  const buttonRef = React.useRef(null);
  const popperRef = React.useRef(null);
  useClickOutside({ onClose: () => setVisibility(false), elemRef: buttonRef });

  const { styles, attributes } = usePopper(buttonRef.current, popperRef.current, {
    placement: 'bottom-start',
  });

  return (
    <div ref={buttonRef}>
      <div
        className="z-50 bg-white border shadow"
        ref={popperRef}
        style={styles.popper}
        {...attributes.popper}
        // className={classNames.overlayWrapper}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

export default (props) => {
  const {
    methods = {},
    className,
    onChange,
    label,
    rules = {},
    name,
    readOnly,
    defaultValue = '',
    disabled,
    format,
    ...rest
  } = props;
  const { errors = {}, control } = methods;

  const defaultProps = {
    id: name,
    name: name,
    formatDate: formatDate,
    format: FORMAT,
    parseDate: parseDate,
    placeholder: '',
    onChangeName: 'onDayChange',
    keepFocus: false,
    inputProps: {
      autoComplete: 'off',
      disabled: disabled,
      className: cx('form-control', { 'is-invalid': errors[name] }, className),
      id: name,
      name,
      readOnly: true,
      'data-cy': rest['data-cy'],
    },
  };

  return (
    <>
      <Container className={cx({ 'is-invalid': errors[name] }, className)}>
        {label && (
          <label className="control-label" htmlFor={defaultProps.name}>
            {label} {rules.required && <sup>*</sup>}
          </label>
        )}
        {control ? (
          <Controller
            {...defaultProps}
            control={control}
            rules={rules}
            name={name}
            defaultValue={defaultValue}
            render={({ onChange, value }) => {
              return (
                <>
                  {readOnly ? (
                    <input
                      defaultValue={value && formatDate(new Date(value), format)}
                      className="form-control"
                      readOnly
                    />
                  ) : (
                    <div className="relative">
                      <DayPickerInput
                        onChange={onChange}
                        onDayChange={onChange}
                        {...defaultProps}
                        {...rest}
                        {...(value && { value })}
                        format={format}
                        readonly={true}
                        keepFocus={false}
                        overlayComponent={OverlayComponent}
                      />
                      {value && !disabled && (
                        <i
                          className="absolute text-xl fas fa-times reset-button"
                          onClick={() => methods.setValue(name, '')}
                        />
                      )}
                    </div>
                  )}
                </>
              );
            }}
            {...rest}
          />
        ) : (
          <DayPickerInput onChange={onChange} {...defaultProps} {...rest} readonly={true} />
        )}
        <InputError name={name} methods={methods} />
      </Container>
    </>
  );
};
