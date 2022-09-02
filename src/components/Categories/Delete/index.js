import { inject, observer } from 'mobx-react';
import { isEqual } from 'lodash';
import CategoryItem from '../CategoryItem';
import ChangeChildrenSectionModal from './ChangeChildrenSectionModal';
import React from 'react';
import useToggle from 'hooks/useToggle';

const Delete = ({ items, onToggle, categoryStore }) => {
  const [isDirty, setIsDirty] = React.useState();
  const [selected, setSelected] = React.useState();
  const [itemsToDisplay, setItemsToDisplay] = React.useState(items || []);
  const [itemsToDelete, setItemsToDelete] = React.useState([]);
  const { handleToggle, toggle } = useToggle({ changeChildrenModal: false });

  const [btnType, setTypeBtn] = React.useState();
  const [selectedChildren, setSelectedChildren] = React.useState();
  const [selectedParent, setSelectedParent] = React.useState();

  const Card = ({ data }) => {
    const ref = React.useRef(null);

    const handleList = (data) => {
      if (data.hasChild) {
        setSelected(data);
        handleToggle({ changeChildrenModal: !toggle.changeChildrenModal });
      } else {
        let listToDelete = [...itemsToDelete, data];
        setItemsToDelete(listToDelete);

        let listToDisplay = itemsToDisplay.filter((i) => i._id !== data._id);
        setItemsToDisplay(listToDisplay);
      }
    };

    return (
      <div ref={ref} className="relative cursor-pointer" data-cy="delete_cards">
        <i
          className="absolute top-0 right-0 z-20 p-4 bg-white material-icons bg-opacity-50"
          data-cy={`delete_category_card_${data.name}`}
          onClick={() => handleList(data)}
        >
          clear
        </i>
        <CategoryItem key={data._id} data={data} isClickable={false} />
      </div>
    );
  };

  const onSubmit = async () => {
    await selectedChildren.map(async (i) => {
      if (btnType === 'delete_cat') {
        await categoryStore.delete(i._id);
      } else {
        const payload = { parent: selectedParent._id };
        await categoryStore.update(payload, i._id);
      }
    });

    await itemsToDelete.map(async (i) => await categoryStore.delete(i._id));

    await onToggle();
  };

  React.useEffect(() => {
    setIsDirty(!isEqual(items, itemsToDisplay));
  }, [items, itemsToDisplay]);

  const onChildren = async (type, selected, parent) => {
    setTypeBtn(type);
    setSelectedChildren(selected);
    setSelectedParent(parent);
  };

  return (
    <>
      <div className="mb-8">
        {itemsToDisplay.map((card, i) => (
          <Card key={i} index={i} id={i} data={card} />
        ))}
      </div>
      <div className="bottom-0 flex items-center justify-end">
        <button className="btn btn-outline" onClick={onToggle} data-cy="cancel_btn">
          Cancel
        </button>
        <button disabled={!isDirty} className="ml-3 btn btn-outline" onClick={onSubmit} data-cy="confirm_btn">
          Save
        </button>
      </div>
      {toggle.changeChildrenModal && (
        <ChangeChildrenSectionModal
          selected={selected}
          onToggle={() => {
            let listToDelete = [...itemsToDelete, selected];
            setItemsToDelete(listToDelete);

            let listToDisplay = itemsToDisplay.filter((i) => i._id !== selected._id);
            setItemsToDisplay(listToDisplay);

            handleToggle({ changeChildrenModal: !toggle.changeChildrenModal });
          }}
          onChildren={(type, selected, parent) => onChildren(type, selected, parent)}
        />
      )}
    </>
  );
};

export default inject(({ categoryStore }) => ({ categoryStore }))(observer(Delete));
