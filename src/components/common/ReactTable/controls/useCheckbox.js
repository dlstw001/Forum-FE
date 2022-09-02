/* eslint-disable no-unused-vars */
import Checkbox from 'components/common/Form/Checkbox';
import cx from 'classnames';
import Dropdown from 'components/common/Dropdown';
import React from 'react';

export default (defaultOptions) => {
  const { isMulti, disabledShowOnly, disabledProp } = defaultOptions;

  return (hooks) => {
    if (isMulti) {
      hooks.visibleColumns.push((columns) => {
        return [
          {
            id: 'check_box',
            groupByBoundary: true,
            Header: (props) => {
              const { getToggleAllRowsSelectedProps, toggleAllRowsSelected, toggleAllPageRowsSelected, page } = props;
              const items = page.filter((i) => !i.original[disabledProp]);
              const checked = items.length ? items.every((i) => i.isSelected) : false;
              const { indeterminate, ...rest } = getToggleAllRowsSelectedProps();

              const handleDropdownSelect = (item) => {
                toggleAllRowsSelected(false);
                switch (item.value) {
                  case 'all':
                    toggleAllPageRowsSelected(true);
                    break;
                  default:
                    toggleAllRowsSelected(false);
                }
              };

              const options = [
                { label: 'All', value: 'all' },
                { label: 'None', value: 'none' },
              ];
              return (
                <>
                  <Dropdown
                    items={options}
                    placement="bottom-end"
                    menuClassname="m-auto"
                    onClick={handleDropdownSelect}
                  >
                    <button className="flex items-center font-semibold tracking-wider uppercase">
                      <Checkbox {...rest} onChange={() => toggleAllPageRowsSelected(!checked)} checked={checked} />
                      <i className="material-icons">arrow_drop_down</i>
                    </button>
                  </Dropdown>
                </>
              );
            },
            Cell: ({ row }) => {
              const { indeterminate, ...rest } = row.getToggleRowSelectedProps();
              const isRowDisabled = !!row.original[disabledProp];
              return !disabledShowOnly ? (
                <Checkbox
                  {...rest}
                  disabled={isRowDisabled}
                  className={cx({ 'force-disabled': isRowDisabled })}
                  data-cy="checkbox_in_table"
                />
              ) : (
                !isRowDisabled && <Checkbox {...rest} />
              );
            },
          },
          ...columns,
        ];
      });
    }
  };
};
