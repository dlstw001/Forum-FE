import { converter } from 'components/common/Form/Editor';
import { differenceInDays, differenceInYears, format, formatDistanceStrict, isToday, parseISO } from 'date-fns';
import { includes, kebabCase } from 'lodash';
import { isEmpty } from 'lodash';
import { ROUTES } from 'definitions';
import { SEC_PER_DAY } from './definitions';
import { trimEnd, trimStart } from 'lodash';
import checkIp from 'check-ip';
import innerText from 'react-innertext';
import ipRegex from 'ip-regex';
import ReactHtmlParser from 'react-html-parser';

export const formatBytes = (bytes) => {
  var i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i];
};

export const dateFormat = (date, formatString = 'd MMM yyyy') => {
  return date ? format(new Date(date), formatString) : '';
};

export const timeFormat = (date, formatString = 'hh:mm:ss') => {
  return date ? format(new Date(date), formatString) : '';
};

export const dayDifference = (value) => differenceInDays(parseISO(value), new Date());

export const timeAgoFormat = (date) => {
  return date ? formatDistanceStrict(new Date(date), new Date(), { addSuffix: true }) : '';
};

export const timeFormatScroller = (date) => {
  return date
    ? differenceInYears(new Date(), parseISO(date)) > 1
      ? dateFormat(date, 'MMM yyyy')
      : timeAgoFormat(date)
    : '';
};

export const removeEmpty = (obj) => {
  let newObj = {};
  Object.keys(obj).forEach((prop) => {
    if (obj[prop]) {
      newObj[prop] = obj[prop];
    }
  });
  return newObj;
};

export const getTopicUrl = ({ slug, discourse_topic_id, _id, lastReadReplyNo, noReplies }, replyNo) => {
  let focusedReply;

  if (lastReadReplyNo && lastReadReplyNo < noReplies) focusedReply = lastReadReplyNo + 1;
  else if (lastReadReplyNo && lastReadReplyNo === noReplies) focusedReply = lastReadReplyNo;
  else focusedReply = '';

  return `${ROUTES.TOPIC}/${slug}/${discourse_topic_id || _id}${replyNo ? `/${replyNo}` : `/${focusedReply}`}`;
};

export const getMessageUrl = ({ _id, lastReadReplyNo, noReplies }, replyNo) => {
  let focusedReply;

  if (lastReadReplyNo && lastReadReplyNo < noReplies) focusedReply = lastReadReplyNo + 1;
  else if (lastReadReplyNo && lastReadReplyNo === noReplies) focusedReply = lastReadReplyNo;
  else focusedReply = '';

  return `${ROUTES.MESSAGES}/${_id}${replyNo ? `/${replyNo}` : `/${focusedReply}`}`;
};

export const colorHex = (value) => {
  return value[0] === '#' ? value : '#' + value;
};

export const notificationType = (obj) => {
  let message, link, replyNo;
  switch (obj.type) {
    case 4: // edited
      message = obj.message.topic_title;
      link = getTopicUrl(obj.post);
      break;

    case 6: // private_message
      message = obj.message.topic_title;
      link = `${ROUTES.MESSAGES}/${obj.post?._id}`;
      break;

    case 7: // invited_to_private_message
      message = obj.message.topic_title;
      link = `${ROUTES.MESSAGES}/${obj.post._id}`;
      break;

    case 8: // invitee_accepted
      message = obj.message.username;
      link = `${ROUTES.PROFILE}/${obj.message.username}`;
      break;

    case 10: // moved_post
      message = obj.message.topic_title;
      link = `${ROUTES.MESSAGES}/${obj.post._id}`;
      break;

    case 12: // granted_badge
      message = obj.message.username;
      link = `${ROUTES.PROFILE}/${obj.message.username}`;
      break;

    case 14: // custom
      message = obj.message.message;
      link = getTopicUrl(obj.post);
      break;

    case 16: // group_message_summary
      message = obj.message.username;
      link = `${ROUTES.PROFILE}/${obj.message.username}`;
      break;

    case 17: // watching_first_post
      message = obj.message.topic_title;
      link = getTopicUrl(obj.post);
      break;

    case 18: // topic_reminder
      message = obj.message.username;
      link = `${ROUTES.PROFILE}/${obj.message.username}`;
      break;

    case 19: // liked_consolidated
      message = obj.message.username;
      link = `${ROUTES.PROFILE}/${obj.message.username}`;
      break;

    case 20: // post_approved
      break;

    case 21: // code_review_commit_approved
      break;

    case 22: // membership_request_accepted
      break;

    case 23: // membership_request_consolidated
      break;

    case 25: // reaction
      break;

    case 26: // votes_released
      break;

    case 27: // event_reminder
      break;

    case 28: // event_invitation
      break;
    case 29:
      message = 'A topic has been flagged.';
      link = `${ROUTES.REVIEW}/?post_id=${obj.message.original_post_id}`;
      break;
    case 30:
      message = `Your ${!isEmpty(obj.reply) ? 'reply' : 'topic'} has been flagged`;
      link = !isEmpty(obj.post) ? getTopicUrl(obj.post, obj?.reply?.replyNo || 0) : '/';
      break;
    case 31:
      message = `Your ${!isEmpty(obj.reply) ? 'reply' : 'topic'} has been published.`;
      link = !isEmpty(obj.post) ? getTopicUrl(obj.post, obj?.reply?.replyNo || 0) : '/';
      break;
    default:
      message = obj.message.topic_title || '';
      replyNo = obj.reply?.replyNo || 0;
      link = !isEmpty(obj.post) ? getTopicUrl(obj.post, replyNo) : '/';
      break;
  }
  let res = { message: message, link: link, createdAt: dateFormat(obj.createdAt) };

  return res;
};

export const showCreateCasesButton = (user) => {
  return (
    includes(user?.roles, 'pcp') ||
    includes(user?.roles, 'partner') ||
    includes(user?.roles, 'end_user') ||
    // Just for testing purposes. Will going to remove once everything is settled.
    includes(user?.roles, 'super_admin') ||
    includes(user?.roles, 'administrator') ||
    user?.admin
  );
};

export const badge = () => JSON.parse(localStorage.getItem(process.env.REACT_APP_APP_NAME))?.badge;

export const maybePluralize = (count, noun, suffix = 's') => `${noun}${count !== 1 ? suffix : ''}`;

export const clearSelection = () => {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
};

export const renameFiles = (files) =>
  files.map((file) => {
    const fileName = file.name.split('.');
    return new File([file], `${kebabCase(fileName[0])}.${fileName[fileName.length - 1]}`, { type: file.type });
  });

export const imageUploader = async (files, onUpload) => {
  const promises = [];
  for (let index = 0; index < files.length; index++) {
    const { file, form, config } = files[index];
    const res = await onUpload(file, form, config);
    let dimensions;

    const promise = new Promise((resolve) => {
      var reader = new FileReader();
      reader.onload = async () => {
        var img = new Image();
        img.onload = function () {
          dimensions = {
            width: img.width,
            height: img.height,
          };
          resolve({ ...res, dimensions });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
    promises.push(promise);
  }

  return await Promise.all(promises).then((res) => {
    const response = res.map((i, index) => {
      return { name: files[index].file.name, url: i.url, dimensions: i.dimensions };
    });
    return response;
  });
};

export const distanceDateFormat = (date) => {
  return isToday(new Date(date)) ? timeAgoFormat(date) : dateFormat(date, 'd MMM yyyy K:mm a');
};

export const getCaseUrl = ({ slug }, replyNo) => {
  return `${ROUTES.CASES}/${slug}${replyNo ? `/${replyNo}` : ``}`;
};

export const addQueryParams = (key, value, history) => {
  const pathname = history.location.pathname;
  const searchParams = new URLSearchParams(history.location.search);
  searchParams.set(key, value);
  history.push({
    pathname: pathname,
    search: searchParams.toString(),
  });
};

export const removeQueryParams = (key, history) => {
  const pathname = history.location.pathname;
  const searchParams = new URLSearchParams(history.location.search);

  if (searchParams.has(key)) {
    searchParams.delete(key);
    history.replace({
      pathname: pathname,
      search: searchParams.toString(),
    });
  }
};

export const getSlug = (link) => {
  const url = new URL(link);
  const removedTrailingSlash = trimEnd(url.pathname, '/');
  const removedStartingSlash = trimStart(removedTrailingSlash, '/');
  const splitted = removedStartingSlash.split('/');

  return splitted[1];
};

export const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export const parseHTML = (data, transform) => ReactHtmlParser(converter.makeHtml(data), { transform });

export const htlmToPlainText = (data) => innerText(parseHTML(data)).replace(/<[^>]+>/g, '');

export const scrollTo = (el) => {
  el.classList.add('glow');
  el.scrollIntoView(true);

  setTimeout(() => {
    el.classList.remove('glow');
  }, 3000);
};

export const daysVisited = (readingTime) => Math.floor(readingTime / SEC_PER_DAY);

export const checkForPublicIP = (text) => {
  if (ipRegex().test(text)) {
    const ips = text.match(ipRegex());
    const items = ips.map((element) => checkIp(element)).filter((i) => i.isPublicIp);
    return items;
  } else {
    return null;
  }
};
