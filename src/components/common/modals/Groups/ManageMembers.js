import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import { isEqual } from 'lodash';
import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import { useForm } from 'react-hook-form';
import AsyncSelect from 'components/common/Form/AsyncSelect';
import React from 'react';

const ManageMembers = ({ userStore, groupStore, onToggle, onSuccess, data, isSystem }) => {
  const [isDirty, setIsDirty] = React.useState();
  const methods = useForm();
  const { reset, handleSubmit, watch } = methods;
  const { users } = watch();
  React.useEffect(() => {
    if (data) {
      reset({
        users: data,
      });
    }
  }, [reset, data]);

  React.useEffect(() => {
    setIsDirty(!isEqual(users, data));
  }, [users, data]);

  const loadOptions = debounce((keyword, callback) => {
    if (keyword) {
      userStore.find({ displayName: keyword }).then((res) => {
        callback(res.data);
      });
    } else {
      callback([]);
    }
  }, 300);

  const onSave = async (data) => {
    const payload = { users: data.users.map((i) => i._id).join() };
    await groupStore.update(groupStore.data.item._id, payload);
    onSuccess();
    onToggle(false);
  };

  return (
    <Modal size="sm" containerClass="bg-secondary  overflow-auto" onToggle={onToggle}>
      <form className="p-8" onSubmit={handleSubmit(onSave)}>
        <ModalHeader onToggle={onToggle}>Select User</ModalHeader>
        <div className="mb-4 form-group">
          <div className="group-modal-title">Select User</div>
          <AsyncSelect
            name="users"
            className="mb-6"
            methods={methods}
            rules={{ required: true }}
            cacheOptions
            defaultOptions
            loadOptions={loadOptions}
            getOptionLabel={(option) => option.displayName}
            getOptionValue={(option) => option._id}
            components={{ DropdownIndicator: null }}
            placeholder="Please select"
            isClearable={true}
            data-cy="select_users"
            isMulti
          />
        </div>
        <ModalFooter>
          <button onClick={() => onToggle()} className="btn btn-outline" data-cy="cancel_btn">
            Cancel
          </button>
          {!isSystem && (
            <button disabled={!isDirty} type="submit" className="ml-3 btn btn-outline" data-cy="confirm_btn">
              Submit
            </button>
          )}
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default inject(({ userStore, groupStore }) => ({
  userStore,
  groupStore,
}))(observer(ManageMembers));
