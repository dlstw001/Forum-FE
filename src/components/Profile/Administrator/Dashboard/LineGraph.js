import { dateFormat } from 'utils';
import { inject, observer } from 'mobx-react';
import { Line } from 'react-chartjs-2';
import React from 'react';
import Tooltip from 'components/common/Tooltip';

const LineGraph = ({ data }) => {
  var dateArray = [];

  data.data && data.data.data && data.data.data.date.map((i) => dateArray.push(dateFormat(i)));

  var dataTable = {
    labels: dateArray,
    datasets: [
      {
        label: data.name,
        fill: true,
        lineTension: 0.1,
        backgroundColor: 'rgba(15,136,193,0.5)',
        borderColor: 'rgba(0,136,204,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(0,136,204,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 5,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(0,136,204,1)',
        pointHoverBorderColor: 'rgba(0,136,204,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: data.data && data.data.data && data.data.data.count,
      },
    ],
  };

  return (
    <div className="p-4">
      <div className="flex flex-row items-center">
        <h3 className="report-subtitle">{data.name}</h3>
        <Tooltip placement="bottom" trigger="hover" tooltip={data?.tooltip}>
          <i className="ml-1 forum-helper material-icons md-18">help</i>
        </Tooltip>
      </div>
      <Line data={dataTable} />
    </div>
  );
};

export default inject(() => ({}))(observer(LineGraph));
