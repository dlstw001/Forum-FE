import cx from 'classnames';
import InputError from './InputError';
import React from 'react';

const Container = ({ className, children, plain }) =>
  plain ? <>{children}</> : <div className={cx('form-group', className)}>{children}</div>;

export default ({
  onChange,
  defaultValue = '',
  type,
  methods = {},
  rules = {},
  name,
  id = name,
  label,
  className,
  containerClassName,
  plain = false,
  ...rest
}) => {
  const { register, errors = {} } = methods;

  const defaultProps = {
    type,
    name,
    id,
    defaultValue,
    className: cx({ 'is-invalid': errors[name] }, { 'form-control': type !== 'checkbox' }, className),
  };

  return (
    <>
      <Container plain={plain} className={containerClassName}>
        {label && (
          <label htmlFor={id} className={cx({ 'is-field-invalid': errors[name] })}>
            {label} {rules.required && <sup>*</sup>}
          </label>
        )}
        <input onChange={onChange} {...defaultProps} {...rest} {...(register && { ref: register(rules) })} />

        <InputError name={name} methods={methods} />
      </Container>
    </>
  );
};
