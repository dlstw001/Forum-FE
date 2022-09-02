import { ARCHETYPE } from 'components/common/ReplyForm';
import { getMessageUrl, getTopicUrl, timeAgoFormat } from 'utils';
import AvatarMedia from 'components/common/AvatarMedia';
import Dropdown from 'components/common/Dropdown';
import DropdownMenu from 'components/common/DropdownMenu';
import React from 'react';

export default ({ data, handleDeleteDraft, handlEditDraft }) => {
  const DROPDOWN_BUTTONS = [
    {
      label: `edit ${data.isPost ? 'topic' : 'reply'}`,
      handler: handlEditDraft,
      'data-cy': 'edit_draft_btn',
    },
    {
      label: 'remove',
      handler: handleDeleteDraft,
      'data-cy': 'delete_draft_btn',
    },
  ];
  return (
    <div className="mb-6 topic-row topic-row-bottom">
      <div className="flex items-center mb-4">
        <AvatarMedia
          urlGenerator={data.archetype === ARCHETYPE.REGULAR ? getTopicUrl : getMessageUrl}
          data={data.post || data}
          user={data.creator}
        />
        <div className="flex items-center ml-auto">
          <span className="mr-2 last-activity">
            Last Updated: {data.updatedAt ? timeAgoFormat(data.updatedAt) : timeAgoFormat(data.createdAt)}
          </span>
          <Dropdown
            placement="bottom-end"
            menuClassname="action-menu"
            className="flex items-center h-full ml-auto"
            menu={({ style }) => (
              <ul className="text-gray-500 bg-secondary menu" style={style}>
                {DROPDOWN_BUTTONS.map((i) => (
                  <DropdownMenu key={i.label} item={i} handleClick={i.handler} />
                ))}
              </ul>
            )}
          >
            <i className="ml-auto material-icons btn-action" data-cy="action_menu_dropdown">
              more_vert
            </i>
          </Dropdown>
        </div>
      </div>
      {/* <p>{data.post ? data.postSummary : data.summary}</p> */}
    </div>
  );
};
