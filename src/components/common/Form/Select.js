import { Controller } from 'react-hook-form';
import { get } from 'react-hook-form';
import cx from 'classnames';
import Input from './Input';
import InputError from './InputError';
import React from 'react';
import ReactSelect from 'react-select';

const Container = ({ plain, children, readOnly }) =>
  plain ? <>{children}</> : <div className={cx('form-group', { 'form-select': !readOnly })}>{children}</div>;

export default (props) => {
  const {
    label,
    className,
    rules = {},
    methods = {},
    name,
    onChange,
    components,
    plain = false,
    defaultValue = null, // = props.isMulti ? [] : {},
    options,
    ...rest
  } = props;
  const { control, setValue, clearErrors, errors = {} } = methods;
  const hasError = get(errors, name);
  const ref = React.useRef();

  const defaultComponents = {
    ...(rest.readOnly && {
      DropdownIndicator: null,
    }),
    ...components,
  };

  React.useEffect(() => {
    if (ref.current && ref.current.select.controlRef.closest('.form-control') && props['data-cy']) {
      ref.current.select.controlRef.closest('.form-control').setAttribute('data-cy', props['data-cy']);
    }
  }, [props]);

  const styles = {
    menu: (styles) => {
      return {
        ...styles,
        borderRadius: 0,
        marginTop: 1,
        zIndex: 100,
      };
    },

    control: (styles, { isFocused }) => {
      return {
        ...styles,
        borderColor: isFocused ? '#000' : hasError ? '#cc4a4a' : '#efefef',
        borderWidth: 0,
        boxShadow: null,
        '&:hover': null,
        borderRadius: 0,
        backgroundColor: rest.isBrown ? '#F3F1ED' : rest.isDisabled ? '#e9ecef' : '#FFF',
      };
    },

    option: (styles, { isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isDisabled ? null : isSelected ? '#CCC' : isFocused ? '#CCC' : null,
        color: '#000',
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled && '#CCC',
        },
      };
    },
  };

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
  const Component = rest.readOnly ? Input : ReactSelect;

  return (
    <Container plain={plain} readOnly={rest.readOnly}>
      {label && (
        <label>
          {label} {rules.required && <sup>*</sup>}
        </label>
      )}
      {control ? (
        <>
          <Controller
            name={name}
            control={control}
            rules={rules}
            defaultValue={defaultValue}
            render={(props) => {
              return (
                <Component
                  {...{
                    ...props,
                    classNamePrefix: 'react-select',
                    isClearable: true,
                    components: { ...defaultComponents },
                    options,
                    onChange: handleChange,
                    styles,
                    ...rest,
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
        </>
      ) : (
        <ReactSelect
          classNamePrefix="react-select"
          onChange={handleChange}
          name={name}
          defaultValue={defaultValue}
          className={cx('form-control', className)}
          options={options}
          {...rest}
          components={{ ...defaultComponents }}
        />
      )}
    </Container>
  );
};

export const styles = {
  control: (styles) => {
    return {
      ...styles,
      borderWidth: 0,
      borderRadius: 0,
      boxShadow: null,
      fontSize: 12,
    };
  },
  menu: (styles) => {
    return {
      ...styles,
      marginTop: 1,
      borderWidth: 0,
      borderRadius: 0,
      fontSize: 12,
    };
  },
};
