import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { inject, observer } from 'mobx-react';
import { isEqual } from 'lodash';
import CategoryItem from '../CategoryItem';
import React from 'react';

export const ItemTypes = {
  CARD: 'card',
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  background: isDragging ? '#ffb81c' : '#FFF',
  ...draggableStyle,
});

const Reorder = ({ items: _items, onToggle, categoryStore }) => {
  const [isDirty, setIsDirty] = React.useState();
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    setItems(_items);
  }, [_items]);

  const onSubmit = () => {
    const data = items.map((item, index) => ({ id: item._id, order: index + 1 }));

    categoryStore.reorderCategory({ data }).then(() => onToggle());
  };

  React.useEffect(() => {
    setIsDirty(!isEqual(items, _items));
  }, [_items, items]);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const payload = reorder(items, result.source.index, result.destination.index);

    setItems(payload);
  };
  return (
    <>
      <div className="mb-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {items.map((item, index) => (
                  <Draggable key={item._id} draggableId={item._id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      >
                        <div className="flex items-start">
                          <CategoryItem key={item._id} data={item} />
                          <span className="pt-2 ml-auto cursor-pointer material-icons-outlined">drag_indicator</span>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div className="bottom-0 flex items-center justify-end">
        <button className="btn btn-outline" onClick={onToggle} data-cy="cancel_btn">
          Cancel
        </button>
        <button disabled={!isDirty} className="ml-3 btn btn-outline" onClick={onSubmit} data-cy="confirm_btn">
          Save
        </button>
      </div>
    </>
  );
};

export default inject(({ categoryStore }) => ({ categoryStore }))(observer(Reorder));
