import React from 'react';
import styled from 'styled-components';

class NumberInput extends React.Component {
  handleKeyDown = (e) => {
    const { type } = this.props;
    if (type !== 'currency') {
      switch (e.key) {
        case '.':
        case 'e':
          e.preventDefault();
          break;
        default:
      }
    }
  };
  render() {
    const { value = '', ...rest } = this.props;
    return <NumberInputStyled value={value} {...rest} />;
  }
}

const NumberInputStyled = styled.input`
  width: 22px;
  text-align: center;
`;

export default NumberInput;
