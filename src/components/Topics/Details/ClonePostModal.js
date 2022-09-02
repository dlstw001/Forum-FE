import { colorHex } from 'utils';
import { components } from 'react-select';
import { inject, observer } from 'mobx-react';
import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import { ROUTES } from 'definitions';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import React from 'react';
import Select from 'components/common/Form/Select';

const Option = (props) => {
  const { data } = props;

  return (
    <components.Option {...props}>
      <div className="flex items-center">
        {data.read_restricted && <i className="material-icons md-12 archived">lock</i>}
        <span className="w-3 h-3 mr-2" style={{ backgroundColor: colorHex(data.color) }} />
        <span className="mr-4">{data.name}</span>
      </div>
    </components.Option>
  );
};

const ClonePostModal = ({ id, onToggle, postStore, categoryStore }) => {
  const methods = useForm();
  const { handleSubmit } = methods;
  const history = useHistory();

  const onSave = async ({ category }) => {
    await postStore
      .clone(id, { category: category._id })
      .then((res) => history.push(`${ROUTES.TOPIC}/${res.item.slug}/${res.item._id}`));
    onToggle();
  };

  React.useEffect(() => {
    categoryStore.all();
  }, [categoryStore]);

  return (
    <Modal size="sm" containerClass="bg-secondary" onToggle={onToggle}>
      <form className="p-6" onSubmit={handleSubmit(onSave)}>
        <ModalHeader onToggle={onToggle}>Clone Post</ModalHeader>
        <Select
          name="category"
          label="Categories"
          methods={methods}
          options={categoryStore?.list?.data || []}
          getOptionValue={(option) => option._id}
          getOptionLabel={(option) => option.name}
          placeholder="All"
          isClearable={false}
          components={{
            Option: Option,
          }}
        />

        <ModalFooter>
          <button className="ml-3 btn btn-outline" data-cy="confirm_btn">
            Clone Post
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default inject(({ categoryStore, postStore }) => ({ categoryStore, postStore }))(observer(ClonePostModal));
