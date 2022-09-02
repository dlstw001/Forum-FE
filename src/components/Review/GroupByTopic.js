import { getTopicUrl } from 'utils';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import { withRouter } from 'react-router-dom';
import LinkTopicTitle from 'components/common/LinkTopicTitle';
import React from 'react';
import ReactTable from 'components/common/ReactTable';

const GroupByTopic = ({ history, reviewStore, setSelectedTab, setGlobalItems, setAdvanceFilters }) => {
  const [items, setItems] = React.useState({ data: [] });

  const getData = React.useCallback(async () => {
    const payload = {
      limit: 1000,
    };

    let res = await reviewStore.grouped(payload);
    setItems(res);
  }, [reviewStore]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  const redirectToAll = (post_id) => {
    setGlobalItems({ data: [] });
    history.push({
      pathname: ROUTES.REVIEW,
      search: `?post_id=${post_id}`,
    });
    setAdvanceFilters({});
    setSelectedTab('all');
  };

  const columns = [
    {
      accessor: 'title',
      Header: 'Topic',
      style: { width: '75%' },
      Cell: ({
        cell: {
          row: { original },
        },
      }) => <LinkTopicTitle data={original.post} className="font-normal" />,
    },
    {
      accessor: 'count',
      Header: 'Count',
      className: 'text-center',
      Cell: ({
        cell: {
          row: { original },
        },
      }) => (
        <Link to={getTopicUrl(original.post)}>
          <span>{original.count}</span>
        </Link>
      ),
    },
    {
      accessor: 'users',
      Header: 'Reported by',
      className: 'text-center',
      Cell: ({
        cell: {
          row: { original },
        },
      }) => (
        <Link to={getTopicUrl(original.post)}>
          <span>{original.users}</span>
        </Link>
      ),
    },
    {
      accessor: 'details',
      Header: 'Details',
      style: { width: '5%' },
      Cell: ({
        cell: {
          row: { original },
        },
      }) => (
        <button
          id="submit-sn"
          className="w-full ml-3 btn-secondary btn btn-submit"
          onClick={() => redirectToAll(original.post._id)}
          data-cy="details_btn"
        >
          Details
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="mb-8 font-semibold">Total: {items.data.length} messages</div>
      <div className="w-full">
        <ReactTable columns={columns} data={items.data} />
      </div>
    </>
  );
};
export default inject(({ reviewStore }) => ({ reviewStore }))(withRouter(observer(GroupByTopic)));
