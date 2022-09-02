import cx from 'classnames';
import React from 'react';
import shortid from 'shortid';
import styled from 'styled-components';

export default ({
  methods = {},
  id = shortid.generate(),
  rules = {},
  type = 'checkbox',
  name,
  className,
  children,
  ...rest
}) => {
  const { register } = methods;

  return (
    <CheckboxStyled className={cx('check-box', className)}>
      <input type={type} id={id} name={name} {...(register && { ref: register(rules) })} {...rest}></input>
      <label htmlFor={id}>{children}</label>
    </CheckboxStyled>
  );
};

const CheckboxStyled = styled.div`
  margin-bottom: 0;
  position: relative;
  input {
    opacity: 0;
    margin: 0;
    position: absolute;
  }
  label {
    margin-bottom: 0;
    padding-left: 1.5rem;
    &:before,
    &:after {
      transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      border-radius: 3px;
      position: absolute;
      top: 0.2rem;
      left: 0rem;
      display: block;
      width: 1.25rem;
      height: 1.2rem;
      content: '';
    }
    &:before {
      border: 1px solid #adb5bd;
    }
  }
  input[type='radio'] ~ label {
    &:before {
      border-radius: 100%;
    }
  }
  input:checked ~ label {
    &:before {
      background-color: #e5990d;
      border-color: #e5990d;
    }
    &:after {
      background: no-repeat 50%/50% 50%;
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z'/%3E%3C/svg%3E");
    }
  }
  input:disabled ~ label {
    &:before {
      border-color: #ccc;
      background-color: #ccc;
      opacity: 0.5;
      cursor: not-allowed !important;
    }
    &:after {
      background-image: none;
      border: none;
    }
  }
`;
