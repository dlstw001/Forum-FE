import { dateFormat, getTopicUrl } from 'utils';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import React from 'react';
import Tooltip from 'components/common/Tooltip';

const TopReferredTopics = ({ dashboardStore }) => {
  const [items, setItems] = React.useState({ data: [] });

  const getData = React.useCallback(async () => {
    const payload = {
      from: '2000-01-01',
      to: dateFormat(new Date(), 'yyyy-MM-dd'),
    };
    await dashboardStore.getTopReferredPost(payload).then((data) => setItems(data));
  }, [dashboardStore]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  return (
    <section id="top-referred-topics" className="mb-8">
      <h3 className="items-center justify-center report-title">
        Top Referred Topics&nbsp;
        <Tooltip
          placement="bottom"
          trigger="hover"
          tooltip={
            <>
              Topics that have received the most clicks from
              <br />
              external sources.
            </>
          }
        >
          <i className="forum-helper material-icons md-18">help</i>
        </Tooltip>
      </h3>
      <div>
        <div className="mb-4 grid grid-cols-2">
          <h5 className="report-subtitle">Topic</h5>
          <h5 className="ml-auto report-subtitle">Clicks</h5>
        </div>
        <div>
          {items.data.map((item, index) => (
            <div key={index} className="grid grid-cols-2">
              <h3 className="top-refer-item">
                <Link to={getTopicUrl(item)}>{item.name}</Link>
              </h3>
              <h3 className="ml-auto top-refer-clicks">{item.count}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default inject(({ dashboardStore }) => ({ dashboardStore }))(observer(TopReferredTopics));
