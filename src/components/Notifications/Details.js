import { inject, observer } from 'mobx-react';
import { notificationType } from 'utils';
import { useHistory } from 'react-router';
import cx from 'classnames';
import React from 'react';
import ReactTable from 'components/common/ReactTable';

const Details = ({ items, onSelect, isLoading, fetchData, filters, notificationStore }) => {
  const history = useHistory();

  const onClick = React.useCallback(
    async (i) => {
      let arr = [];
      arr.push(i._id);

      const payload = {
        ids: arr,
      };

      await notificationStore.read(payload).then((res) => {
        if (res?.statusCode === 202) {
          history.push(notificationType(i).link);
        }
      });
    },
    [history, notificationStore]
  );

  const columns = [
    {
      accessor: 'message',
      Header: 'Title',
      style: { width: '80%' },
      Cell: ({
        cell: {
          row: { original },
        },
      }) => (
        <div className="flex items-center cursor-pointer" onClick={() => onClick(original)}>
          <span className={cx('break-all', { 'font-normal': original.isRead }, { 'font-semibold': !original.isRead })}>
            {notificationType(original).message}
          </span>
        </div>
      ),
    },
    {
      accessor: 'createdAt',
      Header: 'Created',
      style: { width: '10%' },
      className: 'text-right',
      Cell: ({
        cell: {
          row: { original },
        },
      }) => notificationType(original).createdAt,
    },
  ];

  return (
    <>
      <div className="w-full">
        <ReactTable
          columns={columns}
          data={items.data}
          options={{
            isLoading,
            isMulti: true,
            onSelectionChanged: onSelect,
            disabledProp: 'disabled',
            fetchData,
            filters: filters,
            pageCount: items.total_page,
          }}
        />
      </div>
    </>
  );
};

export default inject(({ notificationStore }) => ({ notificationStore }))(observer(Details));
