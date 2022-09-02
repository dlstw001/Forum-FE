import { ContentState, EditorState } from 'draft-js';
import { inject, observer } from 'mobx-react';
import { isEqual } from 'lodash';
import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
// import { ROUTES } from 'definitions';
import { useForm } from 'react-hook-form';
// import { useHistory } from 'react-router-dom';
import countries from 'countries';
import ct from 'countries-and-timezones';
import Editor, { getStateToContent } from '../Form/Editor';
import Input from 'components/common/Form/Input';
import React from 'react';
import Select from 'components/common/Form/Select';

const ProfileModal = ({ userStore, uploadStore, onToggle, data, update }) => {
  const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());
  const [timezones, setTimezones] = React.useState({ data: [] });
  const [isDirty, setIsDirty] = React.useState();
  const [serverErrors, setServerErrors] = React.useState([]);
  const methods = useForm();
  const {
    handleSubmit,
    reset,
    getValues,
    watch,
    setValue,
    formState: { isSubmitted },
  } = methods;
  const { name, displayName, about, location, website, timezone } = watch();
  // let history = useHistory();

  React.useEffect(() => {
    setTimezones({ data: Object.values(ct.getAllTimezones()) });
  }, [data]);

  React.useEffect(() => {
    if (data?.about) {
      setEditorState(EditorState.createWithContent(ContentState.createFromText(data?.about)));
    }
  }, [data]);

  React.useEffect(() => {
    if (data) {
      reset({
        ...getValues(),
        ...data,
        location: countries.find((item) => item.Name === data?.location),
        timezone: timezones.data.find((i) => i.name === data?.timezone),
      });
    }
  }, [reset, data, getValues, timezones]);

  React.useEffect(() => {
    setIsDirty(
      !isEqual(
        { name, displayName, about, location, website, timezone: timezone?.name ? timezone?.name : null },
        {
          name: data?.name,
          displayName: data?.displayName,
          about: data?.about,
          location: data?.location,
          website: data?.website,
          timezone: data?.timezone,
        }
      )
    );
  }, [name, displayName, about, location, website, timezone, data]);

  const handleCurrentTime = () => {
    reset({
      ...getValues(),
      timezone: timezones.data.find((i) => i.utcOffset === -new Date().getTimezoneOffset()),
    });
  };

  const onSave = async ({ about, location, ...rest }) => {
    try {
      const payload = {
        ...rest,
        timezone: timezone ? timezone.name : undefined,
        id: data._id,
        about: about,
        location: location?.Name,
      };

      await userStore.update(payload).then((res) => {
        if (res?.statusCode === 202) {
          update();
        }
      });
      onToggle(false);
    } catch (e) {
      setServerErrors(e.response.data.errors);
    }
  };

  const handleUpload = (file, form, config) => {
    return uploadStore.uploadImage(form, config);
  };

  const handleChange = React.useCallback(
    (e) => {
      setEditorState(e);
      const value = getStateToContent(e);
      setValue('about', value, { shouldValidate: isSubmitted });
    },
    [isSubmitted, setValue]
  );

  return (
    <Modal size="sm" containerClass="bg-secondary overflow-y-auto" onToggle={onToggle}>
      <form className="p-8 pb-6" onSubmit={handleSubmit(onSave)}>
        <ModalHeader onToggle={onToggle}>Edit Profile</ModalHeader>
        <div className="mb-4 form-group">
          <div className="group-modal-title">
            Username <sup>*</sup>
          </div>
          <Input
            className="mb-3"
            name="displayName"
            methods={methods}
            rules={{ required: true }}
            data-cy="displayName"
          />
        </div>
        <div className="mb-4 form-group">
          <div className="group-modal-title">About Me</div>
          <Editor
            name="about"
            className="activated"
            methods={methods}
            onChange={handleChange}
            editorState={editorState}
            options={{
              onGetSuggestions: userStore.mention,
              onUpload: handleUpload,
            }}
            data-cy="about-me"
          />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-4">
          <div className="mb-0 group-modal-title">Location</div>
          <div className="mb-0 group-modal-title">Website</div>
          <Select
            className="mb-4"
            name="location"
            methods={methods}
            options={countries}
            getOptionLabel={(value) => value.Name}
            getOptionValue={(value) => value.Name}
            data-cy="location"
          />
          <Input name="website" className="website-input" methods={methods} data-cy="website" />
        </div>
        <Select
          className="mb-4"
          name="timezone"
          methods={methods}
          options={timezones.data}
          // rules={{ required: true }}
          getOptionLabel={(value) => value.name}
          getOptionValue={(value) => value.name}
          data-cy="select_timezone"
        />
        <div
          className="flex items-center justify-center w-56 mt-5 mb-4 text-sm whitespace-no-wrap btn btn-outline"
          onClick={handleCurrentTime}
        >
          <i className="mr-2 material-icons md-20">public</i>Use Current Timezone
        </div>
        <ModalFooter>
          <button onClick={() => onToggle()} className="btn btn-outline" data-cy="cancel_btn">
            Cancel
          </button>
          <button disabled={!isDirty} className="ml-3 btn btn-outline" data-cy="confirm_btn">
            Submit
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
  );
};

export default inject(({ uploadStore, userStore }) => ({ userStore, uploadStore }))(observer(ProfileModal));
