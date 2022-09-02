import { dateFormat } from 'utils';
import { inject, observer } from 'mobx-react';
import React from 'react';
import Tooltip from 'components/common/Tooltip';

const TopReferred = ({ dashboardStore }) => {
  const [items, setItems] = React.useState({ data: [] });

  const getData = React.useCallback(async () => {
    const payload = {
      from: '2000-01-01',
      to: dateFormat(new Date(), 'yyyy-MM-dd'),
    };
    await dashboardStore.getSearch(payload).then((data) => setItems(data));
  }, [dashboardStore]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <section id="trending-search-terms" className="mb-8">
        <h3 className="items-center justify-center report-title">
          Trending Search Terms&nbsp;
          <Tooltip
            placement="bottom"
            trigger="hover"
            tooltip="Most popular search terms with their click-through rates."
          >
            <i className="forum-helper material-icons md-18">help</i>
          </Tooltip>
        </h3>
        <div>
          <div className="mb-4 grid grid-cols-2">
            <h5 className="report-subtitle">Term</h5>
            <div className="ml-auto text-right grid grid-cols-2">
              <h5 className="report-subtitle">Searches</h5>
              <h5 className="report-subtitle">CTR</h5>
            </div>
          </div>
          {items.data.map((item) => (
            <div className="grid grid-cols-2" key={`key-${item.term}`}>
              <h3 className="trending-search-items">{item.term}</h3>
              <div className="ml-auto grid grid-cols-2 gap-10">
                <h3 className="trending-search-total">{item.total}</h3>
                <h3 className="trending-search-ctr">{item.ctr + '%'}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default inject(({ dashboardStore }) => ({ dashboardStore }))(observer(TopReferred));
