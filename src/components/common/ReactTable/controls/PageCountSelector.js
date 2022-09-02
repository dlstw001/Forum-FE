import React from 'react';

export default ({ onSetPageSize, options, pageSize }) => {
  return (
    <div className="mt-4 rows-per-page">
      {options.perPageText}
      <select className="ml-2" onChange={(e) => onSetPageSize(Number(e.target.value))} defaultValue={pageSize}>
        {[25, 50, 100, 150, 200].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            {pageSize}
          </option>
        ))}
      </select>
    </div>
  );
};
