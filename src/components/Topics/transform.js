import { formatBytes } from 'utils';
import { isEmpty, last, trim, uniq } from 'lodash';
import axios from 'axios';
import services from 'services';
import templates, { TEMPLATE_TYPE } from './templates';

const DOWNLOADS = /^((https?|ftp|smtp):\/\/)?(www.)?(download.peplink.com)+[^\s]+$/gm;
const EXTERNAL_LINK = /(https?:\/\/)[-a-zA-Z0-9:@;?&=/%+.!'(,$_{}^~[\]`#|]+\n+/gm;
const MARKDOWN_IMAGE_LINK = /\[.+\n?\]\(.+\)/g;

const match = (value, regex) => {
  return value?.match(regex) || [];
};

const regexIndexOf = (string, regex, startpos) => {
  var indexOf = string.substring(startpos || 0).search(regex);
  return indexOf >= 0 ? indexOf + (startpos || 0) : indexOf;
};

const getQuotes = (content) => {
  const extractGroup = (value) => {
    return (
      value?.match(
        /((\[quote\]|\[quote=[&quot;"](?<name>[^,]+)?(,\s*post:(?<post>([^,])+))?(,\s*(topic|reply):(?<topic>([^"])+))?[&quot;"]\]))(?<quote>[\s\S]+)\[\/quote\](?<content>[\s\S]*)/i
      )?.groups || null
    );
  };

  let quotes = [];
  const lookup = (context) => {
    const start = regexIndexOf(context, /\[quote\]|\[quote=.+[^\]]\]/gi);
    const end = regexIndexOf(context.substr(start), /\[\/quote\]/gi) + 8;
    return { start, end };
  };

  const extract = (context) => {
    const { start, end } = lookup(context);
    if (start > -1) {
      const quote = context.substr(start, end);

      if (regexIndexOf(quote, /\[quote=.+[^\]]\]/g, 1) > -1) {
        const last = regexIndexOf(context, /\[\/quote\]/g, end) + 8;
        const nested = context.substr(start, last);
        quotes = [...quotes, { hasNested: true, quote: nested, group: extractGroup(nested) }];
      } else {
        const q = extractGroup(quote)?.quote?.replace(/^\s+|\s+$/g, '');
        const group = { ...extractGroup(quote), ...(q && { quote: q }) };
        quotes = [...quotes, { quote, group }];
        extract(context.substr(start + end));
      }
    }
  };

  extract(content);

  return quotes;
};

const getFileIcon = (type) => {
  switch (type) {
    case 'application/pdf':
      return 'pdf';

    default:
      return 'generic';
  }
};

const preview = async (content) => {
  const link = match(content, EXTERNAL_LINK);

  let newContent = content;
  const links = uniq(
    link.filter((i) => !match(i, DOWNLOADS).length).filter((i) => !match(i, MARKDOWN_IMAGE_LINK).length)
  );

  const len = links.length;
  if (len) {
    for (let ctr = 0; ctr <= len - 1; ctr++) {
      try {
        const url = trim(links[ctr]);
        const { title, image, desc } = await services.utilsServices.preview({ url });
        const { hostname } = new URL(url);
        if (!desc) return newContent;
        newContent = newContent.replaceAll(
          url,
          templates(TEMPLATE_TYPE.PREVIEW, {
            hostname,
            title,
            image,
            desc: desc.replace('\n', ' '),
            link: url,
          })
        );
      } catch (error) {
        return content;
      }
    }
    return newContent;
  }

  return content;
};

const downloads = async (content) => {
  const downloads = match(content, DOWNLOADS);
  let newContent = content;
  const len = downloads.length;
  if (len) {
    for (let ctr = 0; ctr <= len - 1; ctr++) {
      const item = downloads[ctr];
      let url = item.replace('https://', '');
      url = url.replace('http://', '');
      try {
        const res = await axios.head(`//${url}`);
        const { hostname, pathname, href } = new URL(res.request.responseURL);

        const icon = getFileIcon(res.headers['content-type']);
        const size = formatBytes(res.headers['content-length']);
        const filename = last(pathname.split('/'));
        newContent = newContent.replace(
          item,
          templates(TEMPLATE_TYPE.DOWNLOAD, { item: href, size, icon, hostname, filename })
        );
      } catch (error) {
        return content;
      }
    }
    return newContent;
  } else {
    return content;
  }
};

const quotes = (content, nested) => {
  const found = getQuotes(nested ? content.substr(1) : content);
  found.forEach(({ quote, group, hasNested }) => {
    if (hasNested) {
      content = quotes(quote, hasNested);
      content = quotes(content);
    } else {
      if (!isEmpty(group)) {
        content = content.replace(
          quote,
          decodeURIComponent(encodeURIComponent(templates(TEMPLATE_TYPE.QUOTE, { groups: group })))
        );
      }
    }
  });
  return content;
};

export default async (content) => {
  let newContent = content;
  if (!newContent) return false;

  newContent = quotes(newContent);
  newContent = await preview(newContent);
  newContent = await downloads(newContent);

  return newContent;
};
