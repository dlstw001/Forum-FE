import { colorHex } from 'utils';
import { inject, observer } from 'mobx-react';
import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import { useForm } from 'react-hook-form';
import React from 'react';
import Select from 'components/common/Form/Select';

const ChangeChildrenSectionModal = ({ selected, onToggle, categoryStore, onChildren }) => {
  const methods = useForm();
  const { handleSubmit, watch, register } = methods;
  const { category, type } = watch();

  React.useEffect(() => {
    categoryStore.all();
  }, [categoryStore]);

  const onSave = async ({ category }) => {
    onToggle();
    onChildren(type, selected.child, category);
  };

  const options = [
    {
      label: 'Delete Straight Away',
      value: 'delete_cat',
    },
    {
      label: 'Move sub-categories',
      value: 'move_cat',
      component: (
        <>
          <Select
            label="Section"
            name="category"
            methods={methods}
            options={categoryStore.items.data.filter((i) => (!i.hasChild && i.parent === undefined) || i.hasChild)}
            rules={{ required: true }}
            getOptionLabel={(value) => (
              <div className="flex items-center">
                <span className="w-3 h-3 mr-2" style={{ backgroundColor: colorHex(value.color) }}></span>
                <span className="mr-4">{value.name}</span>
              </div>
            )}
            getOptionValue={(value) => value.name}
            data-cy="subcategory_change_parent"
          />
        </>
      ),
    },
  ];

  const disabled = !type || (type === 'move_cat' && !category);

  return (
    <Modal size="sm" containerClass="bg-secondary" onToggle={onToggle}>
      <form className="p-6" onSubmit={handleSubmit(onSave)}>
        <ModalHeader onToggle={onToggle}>Change Section</ModalHeader>
        <div className="mb-4">To delete, you first need to move sub-categories to another section</div>

        <div className="mb-4">
          <div className="mb-4 grid grid-cols-3">
            {options.map((i, index) => (
              <label key={index}>
                <div className="flex items-center">
                  <input
                    key={i.label}
                    name="type"
                    ref={register({ required: true })}
                    defaultValue={i.value}
                    className="mr-2"
                    type="radio"
                    methods={methods}
                    data-cy={i.value}
                  />
                  <span>{i.label}</span>
                </div>
              </label>
            ))}
          </div>
          {type && <div className="mb-4">{options.find((i) => i.value === type).description}</div>}

          {type && options.find((i) => i.value === type).component}
        </div>
        <ModalFooter>
          <button onClick={() => onToggle()} className="btn btn-outline" data-cy="cancel_btn">
            Cancel
          </button>
          <button disabled={disabled} className="ml-3 btn btn-outline" data-cy="confirm_btn">
            Submit
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default inject(({ categoryStore }) => ({ categoryStore }))(observer(ChangeChildrenSectionModal));
