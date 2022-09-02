import { Controller } from 'react-hook-form';
import { get } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import cx from 'classnames';
import InputError from './InputError';
import React from 'react';

const Container = ({ plain, children, readOnly }) =>
  plain ? <>{children}</> : <div className={cx('form-group', { 'form-select': !readOnly })}>{children}</div>;

export default (props) => {
  const { label, rules = {}, methods = {}, name, className, plain = false, defaultValue = null, ...rest } = props;
  const { control, errors = {} } = methods;
  const hasError = get(errors, name);
  const ref = React.useRef();

  React.useEffect(() => {
    if (ref.current && ref.current.select.select.controlRef.closest('.form-control') && props['data-cy']) {
      ref.current.select.select.controlRef.closest('.form-control').setAttribute('data-cy', props['data-cy']);
    }
  }, [props]);

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
            <CreatableSelect
              cacheOptions
              defaultOptions
              openMenuOnFocus={false}
              openMenuOnClick={false}
              {...{
                classNamePrefix: 'react-select-async',
                isClearable: true,
                ...rest,
                ...props,
              }}
              className={cx({ 'is-invalid': hasError }, 'form-control', className)}
              ref={(element) => {
                ref.current = element;
              }}
            />
          );
        }}
      />
      <InputError name={name} methods={methods} />
    </Container>
  );
};
