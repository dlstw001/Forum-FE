import React from 'react';

export default ({ data, onAnswer, isSelected }) => {
  const [selected, setSelected] = React.useState();

  React.useEffect(() => {
    if (!isSelected) {
      setSelected(isSelected);
    }
  }, [isSelected]);

  React.useEffect(() => {
    if (selected) {
      data.isSelected = selected;
      onAnswer({ ...selected, type: 'select' });
    }
  }, [selected, onAnswer, data]);

  const handleSelect = (item) => {
    setSelected(item);
  };

  return (
    <li>
      <span className="avatar avatar-tim">
        <i className="icon-chatbot"></i>
      </span>
      <div className="px-3 py-2">
        <div className="mb-4">{data.title}</div>
        {!selected && (
          <ul className="conversation-options">
            {data.options.map((i, key) => (
              <li key={key}>
                <button disabled={i.disabled} onClick={() => handleSelect(i)}>
                  {i.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};
