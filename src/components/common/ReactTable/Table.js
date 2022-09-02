import {
  useExpanded,
  useFilters,
  useGlobalFilter,
  useGroupBy,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import PageCountSelector from './controls/PageCountSelector';
import Pager from './controls/Pager';
import React from 'react';
import TableComponent from './controls/TableComponent';
import useCheckbox from './controls/useCheckbox';

export default ({ template, defaultTableProps, defaultOptions, tableRef, children }) => {
  const tableProps = useTable(
    {
      ...defaultTableProps,
      manualGlobalFilter: false,
      globalFilter: React.useMemo(
        () => (rows, columns, value) => {
          return value.length
            ? rows.filter((row) => {
                const rowValue = row.values['sn'];
                return value[0].value.includes(rowValue);
              })
            : rows;
        },
        []
      ),
    },
    useFilters,
    useGlobalFilter,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    useCheckbox(defaultOptions)
  );

  const {
    gotoPage,
    setPageSize,
    state: { pageSize },
  } = tableProps;

  React.useEffect(() => {
    if (tableRef) {
      tableRef.current = tableProps;
    }
  }, [tableProps, tableRef]);

  const Template = template;
  const Component = template ? Template : TableComponent;

  return (
    <>
      <Component {...tableProps} defaultOptions={defaultOptions} rows={tableProps.page}>
        {children}
      </Component>
      <div className="flex items-center my-8 text-sm table-footer">
        {defaultOptions.totalText && <strong className="mr-3">{defaultOptions.totalText}</strong>}
        {defaultOptions.rowPerPage && (
          <PageCountSelector
            onSetPageSize={(value) => {
              gotoPage(0);
              setPageSize(value);
            }}
            options={defaultOptions}
            pageSize={pageSize}
          />
        )}

        {tableProps.pageCount > 1 && <Pager onChange={(page) => gotoPage(page)} {...tableProps} />}
      </div>
      {/* <pre>
        <code>
          {JSON.stringify(
            {
              // pageIndex,
              // pageSize,
              // pageCount,
              // canNextPage,
              // canPreviousPage,
              // sortBy,
              // groupBy,
              // expanded: expanded,
              filters,
              // selectedRowIds: selectedRowIds,
              // 'selectedFlatRows[].original': selectedFlatRows.map((d) => d.original),
            },
            null,
            2
          )}
        </code>
      </pre> */}
    </>
  );
};
