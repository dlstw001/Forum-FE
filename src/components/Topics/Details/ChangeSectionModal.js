import { colorHex } from 'utils';
import { inject, observer } from 'mobx-react';
import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import { useForm } from 'react-hook-form';
import React from 'react';
import Select from 'components/common/Form/Select';

const ChangeSectionModal = ({ id, onToggle, postStore, categoryStore }) => {
  const methods = useForm();
  const { handleSubmit, watch } = methods;
  const category = watch('category');

  React.useEffect(() => {
    categoryStore.all();
  }, [categoryStore]);

  const onSave = async ({ category }) => {
    await postStore.changeCategory(id, { category: category._id });
    postStore.get(id);
    onToggle();
  };

  return (
    <Modal size="sm" containerClass="bg-secondary" onToggle={onToggle}>
      <form className="p-6" onSubmit={handleSubmit(onSave)}>
        <ModalHeader onToggle={onToggle}>Change Section</ModalHeader>
        <Select
          label="Section"
          name="category"
          methods={methods}
          options={categoryStore.mapped}
          rules={{ required: true }}
          getOptionLabel={(value) => (
            <div className="flex items-center">
              {value.parent && (
                <>
                  <span
                    className="w-3 h-3 mr-2"
                    style={{
                      backgroundColor: colorHex(value.parent.color),
                    }}
                  ></span>
                  <span className="mr-4">{value.parent.name}</span>
                </>
              )}
              <span className="w-3 h-3 mr-2" style={{ backgroundColor: colorHex(value.color) }}></span>
              {value.name}
            </div>
          )}
          getOptionValue={(value) => value.name}
          data-cy="change_section_modal"
        />

        <ModalFooter>
          <button disabled={!category} className="ml-3 btn btn-outline" data-cy="confirm_btn">
            Change Section
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default inject(({ categoryStore, postStore }) => ({ categoryStore, postStore }))(observer(ChangeSectionModal));
