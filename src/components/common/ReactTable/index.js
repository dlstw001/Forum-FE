import { get } from 'lodash';
import ControlledTable from './ControlledTable';
import cx from 'classnames';
import React from 'react';
import styled from 'styled-components';
import Table from './Table';

export default ({ tableRef, template, columns, children, data, updateMyData, skipReset, options, className }) => {
  const defaultOptions = {
    perPageText: 'Results Per Page',
    sortable: true,
    defaultSelected: {},
    pager: true,
    rowPerPage: true,
    ...options,
  };

  const Component = defaultOptions.fetchData ? ControlledTable : Table;
  const defaultPageSize = get(defaultOptions, 'filters.pageSize') || defaultOptions.defaultPageSize || 25;

  const defaultTableProps = {
    columns,
    data,
    disableSortBy: !defaultOptions.sortable,
    autoResetPage: !skipReset,
    autoResetSelectedRows: !skipReset,
    initialState: {
      ...(defaultOptions.defaultSelected && { selectedRowIds: defaultOptions.defaultSelected }),
      pageSize: defaultPageSize,
    },
    defaultColumn: React.useMemo(
      () => ({
        sortable: true,
        width: 20,
        Cell: ({ cell: { value } }) => (typeof value !== 'undefined' && value !== null ? String(value) : null),
      }),
      []
    ),
    updateMyData,
  };
  return (
    <TableWrapperStyled className={cx('table-responsive overflow-auto', className)}>
      <Component
        tableRef={tableRef}
        defaultTableProps={defaultTableProps}
        defaultOptions={defaultOptions}
        skipReset={skipReset}
        options={options}
        template={template}
      >
        {children}
      </Component>
    </TableWrapperStyled>
  );
};

const TableWrapperStyled = styled.div`
  position: relative;
  min-height: 150px;
  th {
    span {
      display: flex;
      .material-icons {
        min-height: 18px;
      }
    }
    &.text-right {
      span {
        justify-content: flex-end;
      }
    }
    &.text-center {
      span {
        justify-content: center;
      }
    }
  }
  th,
  td {
    &.collapsed {
      width: 0.0000000001%;
    }
  }

  .table-footer {
    select,
    input {
      border: none;
    }
    input {
      transition: all 0.3s ease-out;
      width: 30px;
      text-align: center;
      &:focus {
        width: 50px;
      }
    }
    button:focus {
      box-shadow: none;
    }
  }
`;
