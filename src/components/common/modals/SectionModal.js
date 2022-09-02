import { colorHex } from 'utils';
import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Modal, ModalFooter, ModalHeader } from '../Modal';
import { ROUTES } from 'definitions';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';
import AsyncSelect from 'components/common/Form/AsyncSelect';
import Checkbox from '../Form/Checkbox';
import ColorPicker from '../ColorPicker';
import Input from '../Form/Input';
import React from 'react';
import Select from '../Form/Select';
import Uploader from '../Uploader';
import useToggle from 'hooks/useToggle';

const checkIfEveryone = (obj) => obj.name === 'everyone';

const unitSelector = [
  { label: 'hour(s)', key: 'hours' },
  { label: 'day(s)', key: 'days' },
  { label: 'month(s)', key: 'months' },
  { label: 'year(s)', key: 'years' },
];

const CreateGroupModal = ({
  history,
  data,
  groupStore,
  tagStore,
  categoryStore,
  onToggle,
  isParent,
  onSuccess,
  match,
}) => {
  const methods = useForm({
    defaultValues: {
      securityCreate: null,
      securityReply: null,
      securityRead: null,
      restrictTag: null,
      restrictTagGroup: null,
    },
  });
  const { toggle, handleToggle } = useToggle({ colorPicker: false });
  const [color, setColor] = React.useState('#ffb81c');
  const [initialColor, setInitialColor] = React.useState('#ffb81c');
  const [file, setFile] = React.useState();
  const [serverErrors, setServerErrors] = React.useState('');
  const [everyone, setEveryone] = React.useState([]);

  const { reset, getValues, handleSubmit, watch } = methods;
  const { name } = watch();

  React.useEffect(() => {
    categoryStore.all(true);
  }, [categoryStore]);

  React.useEffect(() => {
    tagStore.find({ limit: 1000 });
  }, [tagStore]);

  React.useEffect(() => {
    const autoCloseHours =
      data?.autoCloseHours >= 8760
        ? { count: data?.autoCloseHours / 365 / 24, units: unitSelector[3] }
        : data?.autoCloseHours >= 720
        ? { count: data?.autoCloseHours / 30 / 24, units: unitSelector[2] }
        : data?.autoCloseHours >= 24
        ? { count: data?.autoCloseHours / 24, units: unitSelector[1] }
        : data?.autoCloseHours > 0
        ? { count: data?.autoCloseHours, units: unitSelector[0] }
        : { count: null, units: null };

    reset({ ...getValues(), ...data, ...(autoCloseHours && { ...autoCloseHours }) });
    if (data && data.image) {
      setFile(data.image);
    }
    if (data && data.color) {
      setColor(data.color[0] === '#' ? data.color : `#${data.color}`);
      setInitialColor(data.color[0] === '#' ? data.color : `#${data.color}`);
    }
  }, [reset, getValues, data]);

  React.useEffect(() => {
    groupStore.find({ name: 'everyone' }).then((res) => setEveryone(res.data));
  }, [groupStore]);

  React.useEffect(() => {
    if (!data) {
      reset({ ...getValues(), ...data, crs_group: everyone, rs_group: everyone, s_group: everyone });
    }
  }, [reset, getValues, data, everyone]);

  const loadOptions = debounce((keyword, callback) => {
    if (keyword) {
      groupStore.find({ name: keyword }).then((res) => {
        callback(res.data);
      });
    } else {
      callback([]);
    }
  }, 500);

  const handleUpload = async (values) => {
    setFile(values[0]);
  };

  const onSave = async ({ crs_group, rs_group, s_group, banned_tags, parent, desc, count, units, ...rest }) => {
    let is_everyone_in_any_group =
      (crs_group && crs_group.some(checkIfEveryone)) ||
      (rs_group && rs_group.some(checkIfEveryone)) ||
      (s_group && s_group.some(checkIfEveryone)) ||
      false;

    let closeHours = Number(count) || 0;

    let autoCloseHours =
      units?.key === 'years'
        ? closeHours * 24 * 365
        : units?.key === 'months'
        ? closeHours * 24 * 30
        : units?.key === 'days'
        ? closeHours * 24
        : units?.key === 'hours'
        ? closeHours
        : undefined;

    const payload = {
      ...rest,
      color: color,
      published: true,
      parent: parent?._id ? parent?._id : undefined,
      image: file ? (file?.id ? undefined : file) : undefined,
      desc: desc ? desc : '',
      crs_group: crs_group && crs_group.length > 0 ? crs_group.map((i) => i._id) : undefined,
      rs_group: rs_group && rs_group.length > 0 ? rs_group.map((i) => i._id) : undefined,
      s_group: s_group && s_group.length > 0 ? s_group.map((i) => i._id) : undefined,
      banned_tags: banned_tags && banned_tags.length > 0 ? banned_tags?.map((i) => i._id).join() : '',
      read_restricted: !is_everyone_in_any_group,
      autoCloseHours,
    };

    let form = new FormData();
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== undefined) form.append(key, payload[key]);
    });

    data
      ? await categoryStore
          .update(form, data._id)
          .then(() => {
            onToggle();
            onSuccess();
            history.push(`${isParent ? ROUTES.CATEGORIES : ROUTES.CATEGORY_DETAILS}/${data.slug}`);
          })
          .catch((e) => setServerErrors(e.response.data.errors))
      : await categoryStore
          .create(form)
          .then((res) => {
            onToggle();
            history.push(`${ROUTES.CATEGORY_DETAILS}/${res.item.slug}`);
          })
          .catch((e) => setServerErrors(e.response.data.errors));
  };

  return (
    <>
      <Modal containerClass="overflow-auto bg-secondary" onToggle={onToggle}>
        <form className="p-8" onSubmit={handleSubmit(onSave)}>
          <ModalHeader onToggle={onToggle}>{data ? 'Edit Category' : 'New Category'}</ModalHeader>
          <div className="">
            <div className="group-modal-title">
              Category Name <sup>*</sup>
            </div>
            <Input
              className="mb-3"
              name="name"
              methods={methods}
              rules={{ required: true }}
              data-cy="modal_category_title"
            />

            <h3 className="group-modal-title">Parent Category</h3>
            <Select
              name="parent"
              className="mb-6"
              methods={methods}
              options={categoryStore.list.data.filter((i) => i.parent === undefined)}
              getOptionLabel={(value) => (
                <div className="flex items-center">
                  {value.read_restricted && <i className="material-icons md-12 archived">lock</i>}
                  <span className="w-3 h-3 mr-2" style={{ backgroundColor: colorHex(value.color) }} />
                  <span className="mr-4">{value.name}</span>
                </div>
              )}
              getOptionValue={(value) => value.name}
              data-cy="select_parent"
              defaultValue={
                methods.getValues('parent') ||
                (!isParent && categoryStore.items.data.find((item) => item._id === match.params.id)) ||
                null
              }
            />
            <h3 className="group-modal-title">Category Image</h3>
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

            <div className="group-modal-title">Description</div>
            <Input name="desc" className="mb-3" methods={methods} data-cy="description" />

            <h3 className="group-modal-title">Category Color</h3>
            <div
              className="flex mb-6"
              onClick={() => handleToggle({ colorPicker: !toggle.colorPicker })}
              data-cy="color_picker_modal"
            >
              <div className="w-12" style={{ backgroundColor: color }}></div>
              <div className="p-2 bg-white">{color}</div>
            </div>
            {toggle.colorPicker && (
              <ColorPicker
                color={color}
                setInitialColor={setInitialColor}
                initialColor={initialColor}
                onChange={setColor}
                onToggle={() => handleToggle({ colorPicker: !toggle.colorPicker })}
              />
            )}

            <h3 className="group-modal-title">Security</h3>
            <div className="mb-4 grid grid-cols-1 xl:grid-cols-3 gap-3">
              <AsyncSelect
                label="Create / Reply / Read"
                name="crs_group"
                methods={methods}
                defaultOptions={false}
                loadOptions={loadOptions}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.name}
                components={{ DropdownIndicator: null }}
                placeholder="Please select"
                isClearable={true}
                data-cy="crs_group"
                isMulti
              />
              <AsyncSelect
                label="Reply / Read"
                name="rs_group"
                methods={methods}
                defaultOptions={false}
                loadOptions={loadOptions}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.name}
                components={{ DropdownIndicator: null }}
                placeholder="Please select"
                isClearable={true}
                data-cy="rs_group"
                isMulti
              />
              <AsyncSelect
                label="Read Only"
                name="s_group"
                methods={methods}
                defaultOptions={false}
                loadOptions={loadOptions}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.name}
                components={{ DropdownIndicator: null }}
                placeholder="Please select"
                isClearable={true}
                data-cy="s_group"
                isMulti
              />
            </div>

            <h3 className="group-modal-title">Moderation</h3>
            <div className="mb-6">
              <Checkbox
                name="req_approval_topic"
                methods={methods}
                className="flex items-center mr-2"
                data-cy="approve_topics"
              >
                <div>Require moderator (host) approval of all new topics</div>
              </Checkbox>
              <Checkbox
                name="req_approval_reply"
                methods={methods}
                className="flex items-center mr-2"
                data-cy="approve_replies"
              >
                <div>Require moderator approval of all new replies</div>
              </Checkbox>
            </div>

            <h3 className="group-modal-title">Restriction</h3>
            <Select
              label="Restrict These Tags To This Category"
              name="banned_tags"
              methods={methods}
              isMulti
              options={tagStore.items.data}
              getOptionLabel={(value) => value.name}
              getOptionValue={(value) => value.name}
              data-cy="banned_tags"
              closeMenuOnSelect={false}
            />
            <h3 className="group-modal-title">Auto-close topic after</h3>
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                <Input name="count" className="sm" methods={methods} type="number" min={0} step="any" />
                <Select
                  name="units"
                  methods={methods}
                  options={unitSelector}
                  getOptionLabel={(value) => value.label}
                  getOptionValue={(value) => value.key}
                />
              </div>
              <Checkbox
                name="closeBasedOnLastPost"
                methods={methods}
                className="flex items-center"
                data-cy="approve_replies"
              >
                <div>Don't close until the last post in the topic is at least this old.</div>
              </Checkbox>
            </div>
          </div>
          <ModalFooter>
            <button onClick={() => onToggle()} className="ml-auto btn btn-outline" data-cy="cancel_btn">
              Cancel
            </button>
            <button disabled={!name} className="ml-2 btn btn-outline" data-cy="confirm_btn">
              {data ? 'Update' : 'Create'}
            </button>
          </ModalFooter>
          {!!serverErrors.length && (
            <div className="flex items-center text-danger">
              <i className="ml-auto text-lg material-icons">error_outline</i>
              {serverErrors.map((i) => i.message.charAt(0).toUpperCase() + i.message.slice(1))}
            </div>
          )}
        </form>
      </Modal>
    </>
  );
};

export default inject(({ tagStore, categoryStore, groupStore }) => ({
  tagStore,
  categoryStore,
  groupStore,
}))(withRouter(observer(CreateGroupModal)));
