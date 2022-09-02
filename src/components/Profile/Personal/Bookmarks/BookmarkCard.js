import { timeAgoFormat } from 'utils';
import AvatarMedia from 'components/common/AvatarMedia';
import Dropdown from 'components/common/Dropdown';
import DropdownMenu from 'components/common/DropdownMenu';
import React from 'react';

export default ({ data, handleUnfollow }) => {
  const DROPDOWN_BUTTONS = [
    {
      label: 'remove',
      handler: handleUnfollow,
      'data-cy': 'tpoic_unfollow_btn',
    },
  ];

  return (
    <div className="mb-6 topic-row topic-row-bottom">
      <div className="mb-4 md:flex">
        <AvatarMedia user={data.creator} data={data}></AvatarMedia>
        <div className="flex items-center ml-auto last-activity">
          <span className="mr-2">
            Last Activity: {data.lastModified ? timeAgoFormat(data.lastModified) : timeAgoFormat(data.createdAt)}
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
            <i className="ml-auto material-icons btn-action" data-cy={`${data.title}_action_menu_dropdown`}>
              more_vert
            </i>
          </Dropdown>
        </div>
      </div>
      <p>{data.summary}</p>
    </div>
  );
};
