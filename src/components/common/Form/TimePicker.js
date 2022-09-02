import { Controller } from 'react-hook-form';
import cx from 'classnames';
import InputError from './InputError';
import React from 'react';
import styled from 'styled-components';
import TimePicker from 'react-time-picker';

const Container = ({ children, plain, className }) =>
  plain ? <>{children}</> : <div className={cx('form-group timepicker', className)}>{children}</div>;

export default ({
  defaultValue = '',
  type,
  methods = {},
  rules = {},
  name,
  id = name,
  label,
  className,
  plain = false,
  disabled,
  readOnly,
  containerClassName,
  ...rest
}) => {
  const { control, errors = {} } = methods;
  const defaultProps = {
    type,
    name,
    id,
    value: defaultValue,
    className: cx({ 'is-invalid': errors[name] }, { 'form-control': type !== 'checkbox' }, className),
  };

  const [hideLeading, setHideLeading] = React.useState(false);

  const handleOnChange = (value, callBack = null) => {
    setHideLeading(true);
    if (callBack) {
      callBack(value);
    }
  };

  return (
    <Container plain={plain} className={cx(containerClassName, { 'is-leading-hidden': hideLeading })}>
      {label && (
        <label htmlFor={id}>
          {label} {rules.required && <sup>*</sup>}
        </label>
      )}

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
                <input defaultValue={value} className="form-control" readOnly />
              ) : (
                <div className="relative">
                  <TimePickerStyled
                    onChange={(value) => handleOnChange(value, onChange)}
                    clearIcon={hideLeading && <i className="fas fa-times" />}
                    disableClock={true}
                    format="HH:mm"
                    {...defaultProps}
                    {...rest}
                    {...(value && { value })}
                    disabled={disabled}
                  />
                </div>
              )}
            </>
          );
        }}
        {...rest}
      />

      <InputError name={name} methods={methods} />
    </Container>
  );
};

const TimePickerStyled = styled(TimePicker)`
  background-color: #fff;
  &.react-time-picker--disabled {
    opacity: 0.8;
  }
  .react-time-picker__wrapper {
    border: none;
  }
`;
