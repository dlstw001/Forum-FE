import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Modal, ModalFooter, ModalHeader } from '../../Modal';
import { NOTIFICATIONLVL, POSTINGLVL, ROUTES, VISIBILITYLVL } from 'definitions';
import { removeEmpty } from 'utils';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';
import AsyncSelect from 'components/common/Form/AsyncSelect';
import Checkbox from 'components/common/Form/Checkbox';
import CreatableSelect from 'components/common/Form/CreatableSelect';
import Input from 'components/common/Form/Input';
import React from 'react';
import Select from 'components/common/Form/Select';
import Uploader from 'components/common/Uploader';

const GroupModal = ({ history, userStore, groupStore, onToggle, data, onSuccess }) => {
  const [file, setFile] = React.useState();
  const [serverErrors, setServerErrors] = React.useState([]);
  const methods = useForm();

  const { handleSubmit, reset, watch, getValues } = methods;
  const {
    name,
    owners,
    users,
    visibility_level,
    automatic_membership_email_domains,
    members_visibility_level,
    mentionable_level,
    messageable_level,
    default_notification_level,
  } = watch();

  React.useEffect(() => {
    if (data) {
      if (data && data.flair_icon) {
        setFile(data.flair_icon);
      }

      reset({
        ...data,
        owners: data.users.filter((i) => i.owner),
        automatic_membership_email_domains: data.automatic_membership_email_domains.map((i) => ({
          label: i,
          value: i,
        })),
        visibility_level: VISIBILITYLVL[data.visibility_level],
        members_visibility_level: VISIBILITYLVL[data.members_visibility_level],
        mentionable_level: POSTINGLVL[data.mentionable_level],
        messageable_level: POSTINGLVL[data.messageable_level],
        default_notification_level: NOTIFICATIONLVL[data.default_notification_level],
      });
    }
  }, [reset, data]);

  const loadOptions = debounce((keyword, callback) => {
    if (keyword) {
      userStore.find({ displayName: keyword }).then((res) => {
        callback(res.data);
      });
    } else {
      callback([]);
    }
  }, 300);

  const handleUpload = async (values) => {
    setFile(values[0]);
  };

  const onSave = async ({
    visibility_level,
    members_visibility_level,
    mentionable_level,
    messageable_level,
    default_notification_level,
    users,
    owners,
    name,
    ...rest
  }) => {
    try {
      const payload = {
        ...rest,
        name,
        owners: owners
          .map((i) => i._id)
          .concat(users.map((i) => i._id))
          .map((i) => (owners.map((j) => j._id).includes(i) ? true : false))
          .join(),
        users: owners
          .map((i) => i._id)
          .concat(users.map((i) => i._id))
          .join(),
        automatic_membership_email_domains: automatic_membership_email_domains?.map((i) => i.value).join(),
        image: file,
        visibility_level: visibility_level.value,
        members_visibility_level: members_visibility_level.value,
        mentionable_level: mentionable_level.value,
        messageable_level: messageable_level.value,
        default_notification_level: default_notification_level.value,
        id: data ? data._id : undefined,
      };

      let form = new FormData();
      Object.keys(removeEmpty(payload)).forEach((key) => {
        form.append(key, payload[key]);
      });

      automatic_membership_email_domains === null && form.append('automatic_membership_email_domains', '');

      setServerErrors('');

      data
        ? await groupStore.update(data._id, form).then(() => {
            onSuccess();
            onToggle(false);
          })
        : await groupStore.create(form).then(() => {
            history.push(`${ROUTES.GROUP}/${name}`);
            onToggle(false);
          });
    } catch (e) {
      setServerErrors(e.data.error);
    }
  };

  const toDisable = () =>
    !(
      name &&
      owners &&
      users &&
      visibility_level &&
      members_visibility_level &&
      mentionable_level &&
      messageable_level &&
      default_notification_level
    );

  const createDomain = async (val) => {
    const newObj = { label: val, value: val };
    const values = getValues();
    const mergedArr = (values?.automatic_membership_email_domains || []).concat(newObj);
    reset({ ...values, automatic_membership_email_domains: mergedArr });
  };

  return (
    <Modal size="sm" containerClass="bg-secondary overflow-auto" onToggle={onToggle}>
      <form className="p-8" onSubmit={handleSubmit(onSave)}>
        <ModalHeader onToggle={onToggle}>{data ? 'Update Group' : 'New Group'}</ModalHeader>
        <>
          <div className="group-modal-title">
            Group Name <sup>*</sup>
          </div>
          <Input
            name="name"
            className="mb-3"
            methods={methods}
            rules={{
              required: true,
              pattern: {
                value: /^\S+\w{1,32}\S{1,}/i,
                message: 'Must only include numbers, letters, dashes, dots, and underscores',
              },
            }}
            data-cy="modal_group_title"
          />

          <h3 className="group-modal-title">Group Image</h3>
          <Uploader
            hidden
            name="image"
            className="w-full h-64 mb-6"
            methods={methods}
            onUpload={(value) => handleUpload(value)}
            onClear={() => setFile(undefined)}
            fileOriginal={file}
            data-cy="dropzone"
          />

          <h3 className="group-modal-title">
            Group Owners <sup>*</sup>
          </h3>
          <AsyncSelect
            name="owners"
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
            data-cy="group_owners"
            isMulti
          />

          <h3 className="group-modal-title">
            Group Members<sup>*</sup>
          </h3>
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
            data-cy="group_members"
            isMulti
          />

          <h3 className="group-modal-title">Access</h3>
          <div className="mb-6">
            <Checkbox name="public_admission" methods={methods} className="mr-2" data-cy="public_admission">
              Allow users to join the group freely (Requires publicly visible group)
            </Checkbox>
            <Checkbox name="public_exit" methods={methods} className="mr-2" data-cy="public_exit">
              Allow users to leave the group freely
            </Checkbox>
            <Checkbox
              name="allow_membership_requests"
              methods={methods}
              className="mr-2"
              data-cy="allow_membership_requests"
            >
              Allow users to send membership requests to group owners (Requires publicly visible group)
            </Checkbox>
          </div>

          <h3 className="group-modal-title">Automatic</h3>
          <div className="mb-4">
            <CreatableSelect
              name="automatic_membership_email_domains"
              methods={methods}
              isMulti
              options={[]}
              onCreateOption={createDomain}
              data-cy="select_automatic"
            />
          </div>

          <h3 className="group-modal-title">Visibility</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <Select
              label="Who can see this group?"
              name="visibility_level"
              methods={methods}
              options={VISIBILITYLVL}
              rules={{ required: true }}
              getOptionLabel={(value) => value.name}
              getOptionValue={(value) => value.value}
              data-cy="visibility_level"
            />
            <Select
              label="Who can see this group's members?"
              name="members_visibility_level"
              methods={methods}
              options={VISIBILITYLVL}
              rules={{ required: true }}
              getOptionLabel={(value) => value.name}
              getOptionValue={(value) => value.value}
              data-cy="members_visibility_level"
            />
          </div>

          <h3 className="group-modal-title">Posting</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <Select
              label="Who can @mention this group?"
              name="mentionable_level"
              methods={methods}
              options={POSTINGLVL}
              rules={{ required: true }}
              getOptionLabel={(value) => value.name}
              getOptionValue={(value) => value.value}
              data-cy="mentionable_level"
            />
            <Select
              label="Who can message this group?"
              name="messageable_level"
              methods={methods}
              options={POSTINGLVL}
              rules={{ required: true }}
              getOptionLabel={(value) => value.name}
              getOptionValue={(value) => value.value}
              data-cy="messageable_level"
            />
            <Checkbox name="publish_read_state" methods={methods} data-cy="publish_read_state">
              On group messages publish group read state
            </Checkbox>
          </div>

          <h3 className="group-modal-title">Email</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <Input
              label="Custom incoming email address?"
              name="incoming_email"
              methods={methods}
              rules={{
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'invalid email address',
                },
              }}
              data-cy="incoming_email"
            />
            <Select
              label="Default notification level for group messages?"
              name="default_notification_level"
              methods={methods}
              options={NOTIFICATIONLVL}
              rules={{ required: true }}
              getOptionLabel={(value) => value.name}
              getOptionValue={(value) => value.value}
              data-cy="default_notification_level"
            />
          </div>
        </>
        {!!serverErrors.length && (
          <div className="flex items-center mb-2 text-danger">
            <i className="ml-auto text-lg material-icons">error_outline</i>
            {serverErrors}
          </div>
        )}
        <ModalFooter>
          <button onClick={() => onToggle()} className="ml-auto btn btn-outline" data-cy="cancel_btn">
            Cancel
          </button>
          <button disabled={toDisable()} className="ml-2 btn btn-outline" data-cy="confirm_btn">
            {data ? 'Update' : 'Create'}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default inject(({ userStore, groupStore }) => ({
  userStore,
  groupStore,
}))(withRouter(observer(GroupModal)));
