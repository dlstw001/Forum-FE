export const ROOT_ROUTES = {
  FORUM: process.env.REACT_APP_FORUM_URL,
  CASE: '/case',
  MARKETPLACE: '/marketplace',
  DISCOVER_PARTNERS: process.env.REACT_APP_DIRECTORY_URL,
};

export const FORUM_ALIAS = process.env.REACT_APP_FORUM_ALIAS;

export const LOGOUT_URL = process.env.REACT_APP_LOGOUT_URL;
export const LOGIN_URL = `${process.env.REACT_APP_LOGIN_URL}/${FORUM_ALIAS}`;

export const ROUTES = {
  CALLBACK: '/callback',
  NOT_FOUND: '/404',
  NETWORK_ERROR: '/504',
  TOPIC_ALIAS: `/t`,
  TOPIC: `/t`,
  CATEGORIES: `/categories`,
  CATEGORY_DETAILS: `/c`,
  TAG: `/tags`,
  FOLLOWING: `/following`,
  BOOKMARKS: `/bookmark`,
  PROFILE: `/u`,
  SUMMARY: `/summary`,
  ACTIVITY: '/activity',
  NOTIFICATIONS: `/notification`,
  DRAFT: `/draft`,
  MESSAGES: `/message`,
  SETTINGS: '/preferences',
  DASHBOARD: `/dashboard`,
  GROUP: `/g`,
  USERS: `/admin/users`,
  LOGS: `/logs`,
  BACKUPS: `/backups`,
  CUSTOMER_CASE: `/customer-case`, // TODO: Remove this and replace with CASES
  REVIEW: `/review`,
  SEARCH: `/search`,
  CASES: `${ROOT_ROUTES.CASE}`,
};

export const ROLES = {
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  USER: 'USER',
};

export const SCREENS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1286,
};

export const TRUSTLVL = [
  { value: 0, name: 'New user' },
  { value: 1, name: 'Basic' },
  { value: 2, name: 'Member' },
  { value: 3, name: 'Regular' },
  { value: 4, name: 'Leader' },
];

export const VISIBILITYLVL = [
  { value: 0, name: 'everyone' },
  { value: 1, name: 'logged on users' },
  { value: 2, name: 'group owners, members & moderators' },
  { value: 3, name: 'group owners and moderators' },
  { value: 4, name: 'group owners' },
];

export const POSTINGLVL = [
  { value: 0, name: 'nobody' },
  { value: 1, name: 'only admins' },
  { value: 2, name: 'only moderators and admins' },
  { value: 3, name: 'only group members, moderators and admins' },
  { value: 4, name: 'only group owners, moderators and admins' },
  { value: 99, name: 'everyone' },
];

export const NOTIFICATIONLVL = [
  {
    label: 'Muted',
    name: 'Mute',
    description: 'You will never be notified of anything about this topic, and it will not appear in latest.',
    icon: 'notifications_off',
    value: 0,
  },
  {
    label: 'Normal',
    name: 'Normal',
    description: 'You will be notified if someone mentions your @name or replies to you.',
    icon: 'notifications_none',
    value: 1,
  },
  {
    label: 'Tracking',
    name: 'Tracking',
    description:
      'A count of new replies will be shown for this topic. You will be notified if someone mentions your @name or replies to you.',
    icon: 'notifications',
    value: 2,
  },
  {
    label: 'Watching',
    name: 'Watching',
    description: 'You will be notified of every new reply in this topic, and a count of new replies will be shown.',
    icon: 'notification_important',
    value: 3,
  },
  { label: 'Watching First Post', name: 'Watching First Post', value: 4, icon: 'notification_important' },
];

export const FLAGSTATUS = [
  { value: 0, name: 'Pending', label: 'Pend Post', 'data-cy': 'pending_flag' },
  { value: 1, name: 'Approved', label: 'Approve Post', 'data-cy': 'approve_flag' },
  { value: 2, name: 'Rejected', label: 'Reject Post', 'data-cy': 'reject_flag' },
  { value: 3, name: 'Ignored', label: 'Ignore Post', 'data-cy': 'ignore_flag' },
  { value: 4, name: 'Deleted', label: 'Delete Post', 'data-cy': 'delete_flag' },
];

export const TIMERTIME = [
  { value: 58000, name: 'createTime' },
  { value: 60000, name: 'updateTime' },
];

export const NOTIFICATIONS_TYPE = [
  { value: 1, name: 'mentioned' },
  { value: 2, name: 'replied' },
  { value: 3, name: 'quoted' },
  { value: 4, name: 'edited' },
  { value: 5, name: 'liked' },
  { value: 6, name: 'private_message' },
  { value: 7, name: 'invited_to_private_message' },
  { value: 8, name: 'invitee_accepted' },
  { value: 9, name: 'posted' },
  { value: 10, name: 'moved_post' },
  { value: 11, name: 'linked' },
  { value: 12, name: 'granted_badge' },
  { value: 13, name: 'invited_to_topic' },
  { value: 14, name: 'custom' },
  { value: 15, name: 'group_mentioned' },
  { value: 16, name: 'group_message_summary' },
  { value: 17, name: 'watching_first_post' },
  { value: 18, name: 'topic_reminder' },
  { value: 19, name: 'liked_consolidated' },
  { value: 20, name: 'post_approved' },
  { value: 21, name: 'code_review_commit_approved' },
  { value: 22, name: 'membership_request_accepted' },
  { value: 23, name: 'membership_request_consolidated' },
  { value: 24, name: 'bookmark_reminder' },
  { value: 25, name: 'reaction' },
  { value: 26, name: 'votes_released' },
  { value: 27, name: 'event_reminder' },
  { value: 28, name: 'event_invitation' },
  { value: 29, name: 'reviewer_flag' },
  { value: 30, name: 'creator_flag_created' },
  { value: 31, name: 'creator_flag_updated' },
];

export const HEADER_LINKS = {
  parent: [
    { title: 'Peplink.com', link: process.env.REACT_APP_PEPLINK },
    { title: 'Become a Peplink Partner', link: process.env.REACT_APP_PEPLINK_PARTNER },
    { title: 'Support', link: process.env.REACT_APP_SUPPORT_PAGE },
  ],
  child: [
    // { title: 'Home', link: '/' },
    { title: 'Forum', link: ROOT_ROUTES.FORUM, external: true },
    { title: 'Cases', link: ROOT_ROUTES.CASE },
    // { title: 'Discover Partners', link: ROOT_ROUTES.DISCOVER_PARTNERS, external: true, target: '_blank' },
  ],
};

export const IMAGE_RESIZE = [50, 75, 100];

export const ORDER_BY = {
  ASC: 'asc',
  DESC: 'desc',
};
export const DIRECTION = {
  PREV: 'prev',
  NEXT: 'next',
};

export const SORTING = {
  LATEST: 'latest',
  OLDEST: 'oldest',
  LIKES: 'likes',
};

export const SEC_PER_DAY = 86400;
