import { useExpanded, useFilters, useGroupBy, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import PageCountSelector from './controls/PageCountSelector';
import Pager from './controls/Pager';
import React from 'react';
import TableComponent from './controls/TableComponent';
import useCheckbox from './controls/useCheckbox';

export default ({ children, defaultTableProps, defaultOptions }) => {
  const { filters: controlledFilters = {}, fetchData, pageCount } = defaultOptions;
  const { initialState, ...restTableProps } = defaultTableProps;

  const tableProps = useTable(
    {
      pageCount,
      manualPagination: true,
      manualGlobalFilter: true,
      manualSortBy: true,
      disableSortRemove: true,
      disableMultiSort: true,
      initialState: {
        ...initialState,
        ...(controlledFilters.sortBy && { sortBy: controlledFilters.sortBy }),
      },

      useControlledState: (state) => {
        return React.useMemo(() => {
          return {
            ...state,
            pageIndex: controlledFilters.pageIndex || 0,
            pageSize: controlledFilters.pageSize || 10,
          };
        }, [state]);
      },
      ...restTableProps,
    },
    useFilters,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    useCheckbox(defaultOptions)
  );

  const {
    state: { pageIndex, pageSize, sortBy },
  } = tableProps;

  const [_filters, _setFilters] = React.useState();
  const [_pageIndex, _setPageIndex] = React.useState(pageIndex);
  const [_pageSize, _setPageSize] = React.useState(pageSize);

  React.useEffect(() => {
    let sorting;
    if (sortBy.length) {
      const { id, desc } = sortBy[0];
      sorting = {
        id,
        desc,
      };
    }
    _setFilters({ pageIndex: _pageIndex, pageSize: _pageSize, ...(sorting && { sortBy: [sorting] }) });
  }, [_pageIndex, _pageSize, sortBy]);

  React.useEffect(() => {
    if (_filters) {
      fetchData && fetchData(_filters);
    }
  }, [_filters, fetchData]);
  return (
    <>
      <TableComponent {...tableProps} defaultOptions={defaultOptions} rows={tableProps.rows}>
        {children}
      </TableComponent>

      <div className="flex items-center text-sm table-footer">
        {!defaultOptions.hidePageCountSelector && (
          <PageCountSelector
            onSetPageSize={(value) => {
              _setPageSize(value);
              _setPageIndex(0);
            }}
            options={defaultOptions}
            pageSize={pageSize}
          />
        )}
        {defaultOptions.pageCount > 1 && <Pager onChange={(page) => _setPageIndex(page)} {...tableProps} />}
      </div>

      {/* <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
              sortBy,
              groupBy,
              expanded: expanded,
              filters,
              selectedRowIds: selectedRowIds,
              'selectedFlatRows[].original': selectedFlatRows.map((d) => d.original),
            },
            null,
            2
          )}
        </code>
      </pre> */}
    </>
  );
};
