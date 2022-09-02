import { inject, observer } from 'mobx-react';
import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import { useForm } from 'react-hook-form';
import React from 'react';
import Textarea from 'components/common/Form/Textarea';

const FlagModal = ({ reviewStore, messageStore, groupStore, onToggle, data, mode }) => {
  const methods = useForm();

  const { register, handleSubmit, watch } = methods;
  const { action, raw } = watch();

  const onSave = async ({ ...rest }) => {
    const payload = {
      ...rest,
    };
    let moderator_group = [];

    switch (action) {
      case 'notify_moderators':
        moderator_group = await groupStore.get('moderators');

        await messageStore.post({
          target_groups: [{ group: moderator_group.item }],
          content: raw,
          title: `Flag ${mode === 'post' ? 'Post' : 'Reply'}`,
        });
        break;
      default:
        mode === 'post' ? await reviewStore.post(data._id, payload) : await reviewStore.reply(data._id, payload);
    }
    data.flagged = true;
    onToggle();
  };

  return (
    <Modal size="sm" containerClass="bg-secondary" onToggle={onToggle}>
      <form className="p-8" onSubmit={handleSubmit(onSave)}>
        <ModalHeader onToggle={onToggle}>Thanks for helping to keep our community civil!</ModalHeader>
        <div className="mb-4">
          <div className="group-modal-title">Notify staff privately</div>
          <div>
            <label>
              <div className="flex items-center">
                <input
                  name="action"
                  ref={register({
                    required: true,
                  })}
                  defaultValue="off_topic"
                  className="mr-2"
                  type="radio"
                  methods={methods}
                  data-cy="flag_off_topic"
                />
                <span>It's Off-Topic</span>
              </div>
              <div className="mb-4">
                This post is not relevant to the current discussion as defined by the title and first post, and should
                probably be moved elsewhere.
              </div>
            </label>
            <label>
              <div className="flex items-center">
                <input
                  name="action"
                  ref={register({
                    required: true,
                  })}
                  defaultValue="inappropriate"
                  className="mr-2"
                  type="radio"
                  methods={methods}
                  data-cy="flag_inappropriate"
                />
                <span>It's Inappropriate</span>
              </div>
              <div className="mb-4">
                This post contains content that a reasonable person would consider offensive, abusive, or a violation of
                our community guidelines.
              </div>
            </label>
            <label>
              <div className="flex items-center">
                <input
                  name="action"
                  ref={register({
                    required: true,
                  })}
                  defaultValue="spam"
                  className="mr-2"
                  type="radio"
                  methods={methods}
                  data-cy="flag_spam"
                />
                <span>It's Spam</span>
              </div>
              <div className="mb-4">
                This post is an advertisement, or vandalism. It is not useful or relevant to the current topic.
              </div>
            </label>
            <label>
              <div className="flex items-center">
                <input
                  name="action"
                  ref={register({
                    required: true,
                  })}
                  defaultValue="notify_moderators"
                  className="mr-2"
                  type="radio"
                  methods={methods}
                  data-cy="flag_else"
                />
                <span>Something Else</span>
              </div>
              <div className="mb-4">This post requires staff attention for another reason not listed above.</div>
            </label>
          </div>
          {action === 'notify_moderators' && (
            <Textarea
              placeholder="Let us know specifically what you are concerned about"
              className="mb-3"
              name="raw"
              methods={methods}
              rules={{ required: true }}
              data-cy="flag_raw"
            />
          )}
        </div>
        <ModalFooter>
          <button onClick={() => onToggle()} className="btn btn-outline" data-cy="cancel_btn">
            Cancel
          </button>
          <button
            disabled={!action || (action === 'notify_moderators' && !raw)}
            className="ml-3 btn btn-outline"
            data-cy="confirm_btn"
          >
            Submit
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default inject(({ reviewStore, messageStore, groupStore }) => ({ reviewStore, messageStore, groupStore }))(
  observer(FlagModal)
);
