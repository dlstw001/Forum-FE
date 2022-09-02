import cx from 'classnames';
import InputError from './InputError';
import React from 'react';

const Container = ({ children, plain }) => (plain ? <>{children}</> : <div className="form-group">{children}</div>);

export default ({
  onChange,
  defaultValue = '',
  methods = {},
  rules = {},
  name,
  id = name,
  label,
  className,
  plain = false,
  ...rest
}) => {
  const { register, errors = {} } = methods;

  const defaultProps = {
    type: 'file',
    name,
    id,
    defaultValue,
    className: cx({ 'is-invalid': errors[name] }, className),
  };

  return (
    <>
      <Container plain={plain}>
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
