import { Controller } from 'react-hook-form';
import { get } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import cx from 'classnames';
import InputError from './InputError';
import React from 'react';

const Container = ({ plain, children, readOnly }) =>
  plain ? <>{children}</> : <div className={cx('form-group', { 'form-select': !readOnly })}>{children}</div>;

export default (props) => {
  const {
    label,
    rules = {},
    methods = {},
    name,
    className,
    plain = false,
    defaultValue = null,
    onChange,
    ...rest
  } = props;
  const { control, setValue, clearErrors, errors = {} } = methods;
  const hasError = get(errors, name);
  const ref = React.useRef();

  React.useEffect(() => {
    if (ref.current && ref.current.select.select.controlRef.closest('.form-control') && props['data-cy']) {
      ref.current.select.select.controlRef.closest('.form-control').setAttribute('data-cy', props['data-cy']);
    }
  }, [props]);

  const handleChange = (selected, { action }) => {
    switch (action) {
      case 'clear':
        control && setValue(name, '');
        onChange && onChange(name, []);
        break;
      default:
        control && setValue(name, selected);
        control && clearErrors(name);
        onChange && onChange(name, selected);
    }
  };

  return (
    <Container plain={plain} readOnly={rest.readOnly}>
      {label && (
        <label>
          {label} {rules.required && <sup>*</sup>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={(props) => {
          return (
            <AsyncSelect
              cacheOptions
              defaultOptions
              openMenuOnFocus={false}
              openMenuOnClick={false}
              {...{
                classNamePrefix: 'react-select-async',
                isClearable: false,
                ...rest,
                ...props,
              }}
              className={cx({ 'is-invalid': hasError }, 'form-control z-10', className)}
              ref={(element) => {
                ref.current = element;
              }}
              onChange={handleChange}
            />
          );
        }}
      />
      <InputError name={name} methods={methods} />
    </Container>
  );
};
