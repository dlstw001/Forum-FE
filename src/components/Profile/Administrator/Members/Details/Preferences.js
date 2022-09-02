import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import { useForm } from 'react-hook-form';
import AsyncSelect from 'components/common/Form/AsyncSelect';
import React from 'react';
import ToogleSwitch from 'components/common/ToggleSwitch';
import Tooltip from 'components/common/Tooltip';

const PermissionSection = ({ item, onChange }) => {
  return (
    <div className="flex items-center mb-4">
      <span className="items-center justify-center font-semibold capitalize">
        {item.name}{' '}
        {item?.help && (
          <Tooltip placement="right" trigger="hover" tooltip={item.help}>
            <i className="ml-1 forum-helper material-icons md-14">help</i>
          </Tooltip>
        )}
      </span>
      <div className="ml-auto">
        <ToogleSwitch
          id={item.name}
          name={item.name}
          checked={item.value ? true : false}
          onChange={(e) => onChange(e)}
        />
      </div>
    </div>
  );
};

const Summary = ({ userStore, user, updateCallback, groupStore }) => {
  const methods = useForm();
  const { watch, reset } = methods;
  const { groups } = watch();

  const handleChange = async (item, e) => {
    let payload = {};
    switch (item.name) {
      case 'admin':
        payload = {
          id: user._id,
          admin: e,
        };
        break;
      case 'moderator':
        payload = {
          id: user._id,
          moderator: e,
        };
        break;
      case 'community leader':
        payload = {
          id: user._id,
          leader: e,
        };
        break;
      case 'silenced':
        payload = {
          id: user._id,
          silenced_till: e ? new Date(2099, 12, 31) : null,
        };
        break;
      case 'suspended':
        payload = {
          id: user._id,
          suspended_till: e ? new Date(2099, 12, 31) : null,
        };
        break;
      default:
        break;
    }

    await userStore.update(payload).then(updateCallback);
  };

  const permissionList = [
    {
      name: 'admin',
      value: user?.admin,
      _id: '1',
      help: null,
    },
    {
      name: 'moderator',
      value: user?.moderator,
      _id: '2',
      help: null,
    },
    {
      name: 'community leader',
      value: user?.leader,
      _id: '5',
      help: null,
    },
    {
      name: 'silenced',
      value: user?.silenced_till,
      _id: '3',
      help: "A silenced user can't post or start topics.",
    },
    {
      name: 'suspended',
      value: user?.suspended_till,
      _id: '4',
      help: "A suspended user can't sign in.",
    },
  ];

  const loadOptions = debounce((keyword, callback) => {
    if (keyword) {
      groupStore.find({ name: keyword }).then((res) => {
        callback(res.data);
      });
    } else {
      callback([]);
    }
  }, 300);

  const getGroupList = React.useCallback(async () => {
    if (user) reset({ groups: user.groups });
  }, [user, reset]);

  React.useEffect(() => {
    getGroupList();
  }, [getGroupList]);

  React.useEffect(() => {
    if (groups) {
      if (user?.groups.length < groups.length) {
        const result = groups.filter(({ _id: id1 }) => !user?.groups.some(({ _id: id2 }) => id2 === id1));
        userStore.addToGroup(user._id, result[result.length - 1]._id);
        updateCallback();
      }
      if (user?.groups.length > groups.length) {
        const result = user?.groups.filter(({ _id: id1 }) => !groups.some(({ _id: id2 }) => id2 === id1));
        userStore.removeFromGroup(user._id, result[0]._id);
        updateCallback();
      }
    }
  });

  return (
    <>
      <div className="w-full">
        <div className="mb-4 notifications">
          <h4 className="summary-subtitle">Permissions</h4>
          {permissionList.map((item, index) => (
            <PermissionSection item={item} key={index} onChange={(e) => handleChange(item, e)} />
          ))}
        </div>
        <div className="mb-4 groups">
          <h4 className="summary-subtitle">Groups</h4>
          <AsyncSelect
            name="groups"
            methods={methods}
            rules={{ required: true }}
            cacheOptions
            defaultOptions
            loadOptions={loadOptions}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option._id}
            components={{ DropdownIndicator: null }}
            placeholder="Please select"
            isClearable={true}
            data-cy="target_users"
            isMulti
          />
        </div>
      </div>
    </>
  );
};

export default inject(({ userStore, groupStore }) => ({ userStore, groupStore }))(observer(Summary));
