import React from 'react';

export default ({ style, options, onClick }) => {
  return (
    <div className="watching-list-menu">
      <ul style={{ style }} className="flex flex-col">
        {options.map((i) => (
          <React.Fragment key={i.value}>
            {i.visible ? (
              <li onClick={() => onClick(i.value)} style={{ order: i.order }}>
                <div className="px-4 watching-items">
                  <i className="mr-1 material-icons">{i.icon}</i>
                  {i.label}
                </div>
                <div className="px-4 pb-2 text-xs">{i.description}</div>
              </li>
            ) : null}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};
