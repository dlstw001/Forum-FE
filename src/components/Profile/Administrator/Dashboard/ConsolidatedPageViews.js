import { Bar } from 'react-chartjs-2';
import { dateFormat } from 'utils';
import { inject, observer } from 'mobx-react';
import { useForm } from 'react-hook-form';
import DatePickerModal from 'components/common/modals/DateRangeModal';
import LineGraph from './LineGraph';
import React from 'react';
import Tooltip from 'components/common/Tooltip';
import useToggle from 'hooks/useToggle';

const ConsolidatedPageViews = ({ dashboardStore }) => {
  const [items, setItems] = React.useState({ data: [] });
  const methods = useForm();
  const [advanceFilters, setAdvanceFilters] = React.useState({
    from: dateFormat(new Date().setMonth(new Date().getMonth() - 1), 'yyyy-MM-dd'),
    to: dateFormat(new Date(), 'yyyy-MM-dd'),
  });
  const { handleToggle, toggle } = useToggle({
    datePicker: false,
  });

  const getData = React.useCallback(async () => {
    const payload = { ...advanceFilters };
    await dashboardStore.get(payload).then((data) => {
      setItems(data.pageviews);
    });
  }, [dashboardStore, advanceFilters]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  const onChangeAdvanceFilters = (data) => {
    setItems({ data: [] });
    setAdvanceFilters(data);
  };

  let dateArray = [];
  let dataUserArray = [];
  let dataAnonArray = [];
  let dataBotArray = [];

  items.data.map(
    (item) =>
      dateArray.push(dateFormat(item.date)) &&
      item.data.map(
        (i) =>
          (i.type === 'user' && dataUserArray.push(i.count)) ||
          (i.type === 'anonymous' && dataAnonArray.push(i.count)) ||
          (i.type === 'bot' && dataBotArray.push(i.count))
      )
  );

  const data = {
    labels: dateArray,
    datasets: [
      {
        label: 'Logged in users',
        backgroundColor: 'rgba(0,136,204,0.8)',
        borderColor: 'rgba(0,136,204,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(0,136,204,0.9)',
        hoverBorderColor: 'rgba(0,136,204,1)',
        data: dataUserArray,
      },
      {
        label: 'Anonymous users',
        backgroundColor: 'rgba(65,200,255,0.2)',
        borderColor: 'rgba(65,200,255,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(65,200,255,0.4)',
        hoverBorderColor: 'rgba(65,200,255,1)',
        data: dataAnonArray,
      },
      {
        label: 'Crawlers',
        backgroundColor: 'rgba(235,99,105,0.8)',
        borderColor: 'rgba(235,99,105,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(235,99,105,0.9)',
        hoverBorderColor: 'rgba(235,99,105,1)',
        data: dataBotArray,
      },
    ],
  };

  const barOptions = {
    scales: {
      xAxes: [
        {
          stacked: true,
        },
      ],
      yAxes: [
        {
          stacked: true,
        },
      ],
    },
  };

  const ConsolidatedReportGraphData = [
    {
      name: 'Sign ups',
      data: dashboardStore.data.signups,
      help: 'testing',
      id: 1,
      tooltip: 'New account registrations for this period.',
    },
    {
      name: 'Topics',
      data: dashboardStore.data.replies,
      help: 'testing',
      id: 2,
      tooltip: 'New topics created during this period.',
    },
    {
      name: 'Posts',
      data: dashboardStore.data.posts,
      help: 'testing',
      id: 3,
      tooltip: 'New posts created during this period',
    },
    {
      name: 'DAU/MAU',
      data: dashboardStore.data.dauMau,
      help: 'testing',
      id: 4,
      tooltip: (
        <>
          Number of members that logged in in the last day
          <br />
          divided by number of members that logged in in
          <br />
          the last month – returns a % which indicates
          <br />
          community 'stickiness'. Aim for &gt;30%.
        </>
      ),
    },
    {
      name: 'Daily Engaged Users',
      data: dashboardStore.data.dailyEngagedUsers,
      help: 'testing',
      id: 5,
      tooltip: (
        <>
          Number of users that have liked or posted in the <br />
          last day.
        </>
      ),
    },
    {
      name: 'New Contributors',
      data: dashboardStore.data.newContributors,
      help: 'testing',
      id: 6,
      tooltip: (
        <>
          Number of users who made their first post during
          <br />
          this period.
        </>
      ),
    },
  ];

  return (
    <>
      <div className="pb-8 consolidated-report">
        <div className="flex">
          <div className="flex items-center">
            <h3 className="report-title">Consolidated Pageviews</h3>
            <Tooltip
              placement="bottom"
              trigger="hover"
              tooltip={
                <>
                  Pageviews for logged in users, anonymous users
                  <br /> and crawlers.
                </>
              }
            >
              <i className="mb-4 ml-1 forum-helper material-icons md-18">help</i>
            </Tooltip>
          </div>
          <div className="ml-auto">
            <div className="flex items-center justify-center cursor-pointer">
              <h3 className="datepicker-title">Month</h3>
              <h3 className="datepicker-date" onClick={() => handleToggle({ datePicker: !toggle.datePicker })}>
                {dateFormat(advanceFilters.from) + ' - ' + dateFormat(advanceFilters.to)}
              </h3>
              <i className="mr-1 text-gray-200 material-icons">keyboard_arrow_down</i>
            </div>
            {toggle.datePicker && (
              <DatePickerModal
                onToggle={(show) => {
                  handleToggle({ datePicker: show || !toggle.datePicker });
                }}
                onSubmit={onChangeAdvanceFilters}
                data={{ from: advanceFilters.from, to: advanceFilters.to }}
                methods={methods}
              />
            )}
          </div>
        </div>
        <Bar data={data} options={barOptions} />
        <div className="pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {ConsolidatedReportGraphData.map((item) => (
            <LineGraph key={item.id} data={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default inject(({ dashboardStore }) => ({ dashboardStore }))(observer(ConsolidatedPageViews));
