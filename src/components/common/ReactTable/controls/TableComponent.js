import cx from 'classnames';
import Loading from 'components/common/Loading';
import React from 'react';

export default React.memo(
  ({
    children,
    defaultOptions,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    selectedFlatRows,
    rows,
  }) => {
    const { onRowClick, onSelectionChanged } = defaultOptions;

    React.useEffect(() => {
      onSelectionChanged &&
        onSelectionChanged(selectedFlatRows.filter((i) => !i.original.disabled).map(({ original }) => original));
    }, [onSelectionChanged, selectedFlatRows]);

    return (
      <>
        {defaultOptions.isLoading && <Loading />}
        <table {...getTableProps()} className="table w-full">
          <thead>
            {headerGroups.map((headerGroup, key) => (
              <tr key={`tr-header-${key}`} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, key) => (
                  <th
                    key={`th-header-${key}`}
                    {...column.getHeaderProps([
                      {
                        className: cx({ collapsed: column.id === 'check_box' }, column.className),
                        style: column.style,
                        width: `${column.width}%`,
                      },
                    ])}
                  >
                    <span
                      {...column.getSortByToggleProps()}
                      className={cx(column.headerClassName, {
                        'cursor-pointer': column.accessor && column.sortable && column.canSort,
                      })}
                    >
                      {column.render('Header')}
                      {column.id !== 'check_box' && column.sortable && (
                        <span className="material-icons md-18">
                          {column.isSorted ? (column.isSortedDesc ? 'arrow_drop_down' : 'arrow_drop_up') : ''}
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, key) => {
              prepareRow(row);

              return (
                <tr
                  key={`tr-body-${key}`}
                  {...row.getRowProps()}
                  onClick={(e) => {
                    if (!e.target.closest('.no-row-click')) {
                      onRowClick && onRowClick(row);
                    }
                  }}
                  className={cx({ 'cursor-pointer': onRowClick })}
                >
                  {row.cells.map((cell, key) => {
                    return (
                      <td
                        key={`td-body-${key}`}
                        {...cell.getCellProps([
                          {
                            className: cell.column.className,
                            style: cell.column.style,
                          },
                        ])}
                      >
                        {cell.isGrouped ? (
                          // If it's a grouped cell, add an expander and row count
                          <>
                            <span {...row.getToggleRowExpandedProps()}>{row.isExpanded ? '👇' : '👉'}</span>{' '}
                            {cell.render('Cell', { editable: false })} ({row.subRows.length})
                          </>
                        ) : cell.isAggregated ? (
                          // If the cell is aggregated, use the Aggregated
                          // renderer for cell
                          cell.render('Aggregated')
                        ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                          // Otherwise, just render the regular cell
                          cell.render('Cell', { editable: true })
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {children}
          </tbody>
        </table>

        {!rows.length && !defaultOptions.isLoading && (
          <div className="no-results-found">
            <div className="p-4">No results found</div>
          </div>
        )}
      </>
    );
  }
);
