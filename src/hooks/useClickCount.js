import React from 'react';
import services from 'services';

const re = new RegExp('mailto:.+');

export default (ref, id, content) => {
  const getLinkCount = React.useCallback(
    async (e) => {
      const payload = {
        post_id: id,
        url: e.href,
      };

      if (re.test(e.href)) return false;
      if (e.closest('.quote')) return false;

      const { count } = await services.utilsServices.getCount(payload);
      if (count > 0) {
        const el = e.querySelector('span') || document.createElement('span');
        el.classList.add('badge-count');
        el.innerText = count;
        e.appendChild(el);
      }
    },
    [id]
  );

  const handleLinkClick = React.useCallback(
    async (e) => {
      const target = e.currentTarget;
      const payload = { post_id: id, url: target.href, quote: target.closest('.quote') };
      if (re.test(target.href)) return false;
      await services.utilsServices.addCount(payload);
      getLinkCount(target);
    },
    [id, getLinkCount]
  );

  React.useEffect(() => {
    const { current } = ref;

    setTimeout(() => {
      if (!content) return false;
      current.querySelectorAll('a:not(.mention)').forEach((i) => {
        getLinkCount(i);
        i.addEventListener('click', handleLinkClick);
        i.addEventListener('auxclick', handleLinkClick);
      });
    });
  }, [getLinkCount, handleLinkClick, ref, content]);
};
