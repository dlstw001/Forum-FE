import { debounce } from 'lodash';
import cx from 'classnames';
import NumberInput from 'components/common/NumberInput';
import React from 'react';
import styled from 'styled-components';

const Pager = function ({ className, pageIndex, onChange, canPreviousPage, canNextPage, pageCount }) {
  const [page, setPage] = React.useState(0);
  const debounceRef = React.useRef(
    debounce((newValue) => {
      onChange && onChange(newValue);
    }, 500)
  );

  React.useEffect(() => {
    setPage(pageIndex || 1);
  }, [pageIndex]);

  React.useEffect(() => {
    debounceRef.current(page);
  }, [page]);

  return (
    <div className={cx('flex items-center', className)}>
      <PagerStyled className="flex items-center m-0">
        <li className="page-item">
          <button
            className="page-link material-icons md-dark md-24"
            onClick={() => setPage(page >= 1 ? page - 1 : 0)}
            disabled={!canPreviousPage}
          >
            keyboard_arrow_left
          </button>
        </li>
        <li>
          <form>
            <NumberInput
              value={page}
              onChange={(e) => {
                const value = e.target.value;
                if (value) {
                  const page = value >= 1 ? Number(value) : 0;
                  setPage(page < pageCount ? page : pageCount);
                }
              }}
            />
            <span className="mx-2">of</span>
            {pageCount}
          </form>
        </li>

        <li className="page-item">
          <button
            className="page-link material-icons md-dark md-24"
            onClick={() => setPage(page + 1)}
            disabled={!canNextPage || page >= pageCount}
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
