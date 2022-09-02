import NumberInput from 'components/common/NumberInput';
import React from 'react';
import styled from 'styled-components';

const Pager = function ({ state, onChange, canPreviousPage, canNextPage, pageCount }) {
  const [page, setPage] = React.useState(0);

  React.useEffect(() => {
    setPage(state.pageIndex + 1 || 0);
  }, [state.pageIndex]);

  const handleChange = (page) => {
    onChange(parseInt(page) - 1);
  };
  const handleKeyDown = (e) => {
    let _page = page > pageCount ? pageCount : parseInt(page) === 0 || !page ? 1 : page;
    switch (e.key) {
      case 'Enter':
        handleChange(_page);
        e.preventDefault();

        break;
      default:
        break;
    }
  };
  const handleBlur = () => {
    setPage(state.pageIndex + 1);
  };

  return (
    <div className="flex items-center mt-4 ml-auto">
      <PagerStyled className="flex items-center m-0 pagination">
        <li className="page-item">
          <button
            className="page-link material-icons md-dark md-24"
            onClick={() => handleChange(page - 1)}
            disabled={!canPreviousPage}
          >
            keyboard_arrow_left
          </button>
        </li>
        <li>
          <form>
            <NumberInput
              value={page}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              onChange={(e) => {
                const value = e.target.value;
                setPage(value);
              }}
            />
            <span className="mx-2">of</span>
            {pageCount}
          </form>
        </li>

        <li className="page-item">
          <button
            className="page-link material-icons md-dark md-24"
            onClick={() => handleChange(page + 1)}
            disabled={!canNextPage}
          >
            keyboard_arrow_right
          </button>
        </li>
      </PagerStyled>
    </div>
  );
};

export default Pager;

const PagerStyled = styled.ul`
  input {
    font-size: inherit;
  }
  button:disabled {
    opacity: 0.2;
  }
`;
