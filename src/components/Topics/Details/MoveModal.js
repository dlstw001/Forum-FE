import { debounce, includes, omit } from 'lodash';
import { getTopicUrl } from 'utils';
import { inject, observer } from 'mobx-react';
import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import { ROUTES } from 'definitions';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';
import AsyncSelect from 'components/common/Form/AsyncSelect';
import Categories from 'components/common/fields/Categories';
import CreatableSelect from 'components/common/Form/CreatableSelect';
import Input from 'components/common/Form/Input';
import React from 'react';
import useToggle from 'hooks/useToggle';

const MoveModal = ({
  onToggle,
  data,
  postStore,
  replyStore,
  messageStore,
  userStore,
  categoryStore,
  tagStore,
  history,
}) => {
  const [serverErrors, setServerErrors] = React.useState([]);

  const methods = useForm({
    defaultValues: {
      type: 'new_topic',
      title: '',
      category: null,
      tags: [],
    },
  });

  const { register, handleSubmit, watch, reset, getValues } = methods;
  const { category, tags, topic, type } = watch();

  const { handleToggle, toggle } = useToggle({
    hiddenInfoModal: false,
  });

  React.useEffect(() => {
    tagStore.find({ limit: 1000 });
  }, [tagStore]);

  React.useEffect(() => {
    categoryStore.find({ limit: 1000 });
  }, [categoryStore]);

  React.useEffect(() => {
    postStore.find({ limit: 1000 });
  }, [postStore]);

  const loadOptions = debounce((keyword, callback) => {
    if (keyword) {
      postStore.find({ title: keyword }).then((res) => {
        callback(res.data);
      });
    } else {
      callback([]);
    }
  }, 300);

  const tagsOptions = React.useMemo(() => {
    const tags = tagStore.items.data.map((item) => omit(item, 'count'));
    const banned_tags = category?.banned_tags?.map((item) => item._id) || [];

    return tags.filter((item) => !includes(banned_tags, item._id));
  }, [category, tagStore.items.data]);

  const createTag = async (val) => {
    const values = getValues();
    await tagStore
      .create({ name: val })
      .then(
        async ({ item }) =>
          await reset({ ...values, tags: [{ ...item, label: item.name, value: item.name }, ...(tags || [])] })
      );
  };

  const onSave = async ({ ...rest }) => {
    let payload, res, link;
    try {
      switch (type) {
        case 'new_topic':
          payload = {
            ...rest,
            category: category?._id,
            tags: tags?.map((i) => i?._id),
            raw: data.raw,
            published: true,
          };
          res = await postStore.create(payload);
          link = getTopicUrl(res?.item);
          break;
        case 'existing_topic':
          payload = { raw: data.raw, published: true };
          res = await replyStore.create(topic?._id, payload);
          link = getTopicUrl(topic);
          break;
        case 'new_msg':
          payload = {
            ...rest,
            creator: data.creator._id,
            target_users: [{ user: userStore.user._id }],
            raw: data.raw,
            is_warning: false,
          };
          res = await messageStore.post(payload);
          link = `${ROUTES.MESSAGES}/${res.item._id}`;
          break;
        default:
          break;
      }
      await replyStore.delete(data.post._id, data._id);

      if (!res?.item?.hidden) {
        history.push(link);
      } else {
        handleToggle({ hiddenInfoModal: !toggle.hiddenInfoModal });
      }

      onToggle(false);
    } catch (e) {
      setServerErrors(e.response.data.errors || '');
    }
  };

  const options = [
    {
      label: 'New Topic',
      description: `You are about to create a new topic and populate it with the post you've selected.`,
      value: 'new_topic',
      component: (
        <>
          <div className="group-modal-title">
            Title <sup>*</sup>
          </div>
          <Input
            placeholder="What is this discussion about in one brief sentence?"
            className="mb-3"
            name="title"
            methods={methods}
            rules={{ required: true }}
            data-cy="topic_title"
          />
          <div className="my-6 grid grid-cols-2 gap-x-4">
            <div className="mb-0 group-modal-title">
              Category <sup>*</sup>
            </div>
            <div className="mb-0 group-modal-title">Tags</div>
            <Categories name="category" methods={methods} rules={{ required: true }} />
            <CreatableSelect
              name="tags"
              methods={methods}
              isMulti
              options={tagsOptions}
              getOptionLabel={(value) => value.name || value.label}
              getOptionValue={(value) => value.name || value.value}
              onCreateOption={createTag}
              data-cy="select_tags"
            />
          </div>
        </>
      ),
    },
    {
      label: 'Existing Topic',
      description: `Please choose the topic you'd like to move that post to.`,
      value: 'existing_topic',
      component: (
        <AsyncSelect
          name="topic"
          className="mb-6"
          methods={methods}
          rules={{ required: true }}
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          getOptionLabel={(option) => option.title}
          getOptionValue={(option) => option._id}
          components={{ DropdownIndicator: null }}
          placeholder="Please select"
          isClearable={true}
          data-cy="select_topic"
        />
      ),
    },
    {
      label: 'New Message',
      description: `You are about to create a new message and populate it with the post you've selected.`,
      value: 'new_msg',
      component: (
        <>
          <div className="group-modal-title">
            New Message Title <sup>*</sup>
          </div>
          <Input
            placeholder="What is this discussion about in one brief sentence?"
            className="mb-3"
            name="title"
            methods={methods}
            rules={{ required: true }}
            data-cy="topic_title"
          />
        </>
      ),
    },
  ];

  return (
    <Modal size="lg" containerClass="bg-secondary" onToggle={onToggle}>
      <form className="p-8" onSubmit={handleSubmit(onSave)}>
        <ModalHeader onToggle={onToggle}>Move to</ModalHeader>
        <div className="mb-4">
          <div className="mb-4 grid grid-cols-3">
            {options.map((i, index) => (
              <label key={index}>
                <div className="flex items-center">
                  <input
                    key={i.label}
                    name="type"
                    ref={register({
                      required: true,
                    })}
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
          <button disabled={!type} className="ml-3 btn btn-outline" data-cy="confirm_btn">
            Move to {options.find((i) => i.value === type).label}
          </button>
          {!!serverErrors.length && (
            <div className="flex items-center text-danger">
              <i className="ml-auto text-lg material-icons">error_outline</i>
              {serverErrors.map((i) => i.message.charAt(0).toUpperCase() + i.message.slice(1))}
            </div>
          )}
        </ModalFooter>
      </form>
      {toggle.hiddenInfoModal && (
        <Modal size="sm" containerClass="bg-secondary p-6">
          <ModalHeader>Attention</ModalHeader>
          <div className="mb-4">Your topic is under review by our moderators. Please wait.</div>

          <ModalFooter>
            <button className="ml-3 btn btn-outline" onClick={() => onToggle(false)}>
              Ok
            </button>
          </ModalFooter>
        </Modal>
      )}
    </Modal>
  );
};

export default inject(({ postStore, replyStore, messageStore, userStore, categoryStore, tagStore }) => ({
  postStore,
  replyStore,
  messageStore,
  userStore,
  categoryStore,
  tagStore,
}))(withRouter(observer(MoveModal)));
