import React from 'react';

export default ({ id, name, checked, onChange, disabled }) => {
  return (
    <div className="toggle-switch small-switch">
      <input
        type="checkbox"
        name={name}
        className="toggle-switch-checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      {id ? (
        <label className="toggle-switch-label" htmlFor={id} tabIndex={disabled ? -1 : 1}>
          <span className="toggle-switch-inner" tabIndex={-1} />
          <span className="toggle-switch-switch" tabIndex={-1} />
        </label>
      ) : null}
    </div>
  );
};
