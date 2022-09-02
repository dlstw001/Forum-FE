import { inject, observer } from 'mobx-react';
import { isEqual } from 'lodash';
import React from 'react';

const Delete = ({ items, onToggle, tagStore }) => {
  const [isDirty, setIsDirty] = React.useState();
  const [itemsToDisplay, setItemsToDisplay] = React.useState(items || []);
  const [itemsToDelete, setItemsToDelete] = React.useState([]);

  const Card = ({ data }) => {
    const ref = React.useRef(null);

    const handleList = (data) => {
      let listToDelete = [...itemsToDelete, data];
      setItemsToDelete(listToDelete);

      let listToDisplay = itemsToDisplay.filter((i) => i._id !== data._id);
      setItemsToDisplay(listToDisplay);
    };

    return (
      <div ref={ref} className="flex items-center mb-8 cursor-pointer">
        <div className="flex items-center">
          <div className="tags">{data.name}</div>
        </div>
        <i
          className="right-0 bg-white material-icons bg-opacity-50"
          data-cy={`${data.name}_to_delete`}
          onClick={() => handleList(data)}
        >
          clear
        </i>
      </div>
    );
  };

  const onSubmit = () => {
    itemsToDelete.map((i) => tagStore.delete(i._id).then(() => onToggle()));
  };

  React.useEffect(() => {
    setIsDirty(!isEqual(items, itemsToDisplay));
  }, [items, itemsToDisplay]);

  return (
    <>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {itemsToDisplay.map((card, i) => (
          <Card key={i} index={i} id={i} data={card} />
        ))}
      </div>
      <div className="bottom-0 flex items-center justify-end">
        <button className="btn btn-outline" onClick={onToggle}>
          Cancel
        </button>
        <button disabled={!isDirty} className="ml-3 btn btn-outline" onClick={onSubmit} data-cy="save_after_delete">
          Save
        </button>
      </div>
    </>
  );
};

export default inject(({ tagStore }) => ({ tagStore }))(observer(Delete));
