import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import { useForm } from 'react-hook-form';
import AsyncSelect from 'components/common/Form/AsyncSelect';
import React from 'react';

const ChangeCreatorModal = ({ id, onToggle, postStore, userStore, replyStore, reply_id, type = 'post' }) => {
  const methods = useForm();
  const { handleSubmit } = methods;

  const onSave = async ({ creator }) => {
    if (type === 'post') {
      await postStore.changeCreator(id, { displayName: creator.displayName });
    } else {
      await replyStore.changeCreator(id, reply_id, { displayName: creator.displayName });
    }

    postStore.get(id);
    onToggle();
  };

  const loadOptions = debounce((keyword, callback) => {
    if (keyword) {
      userStore.find({ displayName: keyword }).then((res) => {
        callback(res.data);
      });
    } else {
      callback([]);
    }
  }, 300);

  return (
    <Modal size="sm" containerClass="bg-secondary" onToggle={onToggle}>
      <form className="p-6" onSubmit={handleSubmit(onSave)}>
        <ModalHeader onToggle={onToggle}>Change Creator</ModalHeader>
        <AsyncSelect
          name="creator"
          label="User"
          methods={methods}
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          getOptionLabel={(option) => option.displayName}
          getOptionValue={(option) => option._id}
          components={{ DropdownIndicator: null }}
          placeholder="Search"
          isClearable={true}
          data-cy="target_users"
        />

        <ModalFooter>
          <button className="ml-3 btn btn-outline" data-cy="confirm_btn">
            Change Creator
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default inject(({ userStore, postStore, replyStore }) => ({ userStore, postStore, replyStore }))(
  observer(ChangeCreatorModal)
);
