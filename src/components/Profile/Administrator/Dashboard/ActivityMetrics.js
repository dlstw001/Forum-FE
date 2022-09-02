import { dateFormat } from 'utils';
import { inject, observer } from 'mobx-react';
import { useForm } from 'react-hook-form';
import ActivityMetricsLineGraph from './ActivityMetricsLineGraph';
import DatePickerModal from 'components/common/modals/DateRangeModal';
import React from 'react';
import useToggle from 'hooks/useToggle';

const ActivityMetrics = ({ dashboardStore }) => {
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
    await dashboardStore.getActivity(payload).then((res) => {
      setItems({ data: res });
    });
  }, [dashboardStore, advanceFilters]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  const onChangeAdvanceFilters = (data) => {
    setItems({ data: [] });
    setAdvanceFilters(data);
  };

  const ActivityMetricsData = [
    {
      name: 'User Visits',
      data: items.data.userVisits?.data,
      help: 'testing',
      id: 1,
      tooltip: 'Number of all user visits.',
    },
    {
      name: 'Time to First Response',
      data: items.data.timeToFirstResponse?.data,
      help: 'testing',
      id: 2,
      tooltip: 'Average time (in hours) of the first response to new topics.',
    },
    {
      name: 'Likes',
      data: items.data.likes?.data,
      help: 'testing',
      id: 3,
      tooltip: 'Number of new likes.',
    },
    {
      name: 'Flags',
      data: items.data.flags?.data,
      help: 'testing',
      id: 4,
      tooltip: 'Number of new flags.',
    },
  ];

  return (
    <>
      <div id="activity-metrics">
        <div className="flex flex-row mb-4">
          <div className="report-title">Activity Metrics</div>
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
      </div>
      <div className="mb-8 grid md:grid-cols-2 grid-cols-1 gap-8">
        {ActivityMetricsData.map((item, index) => (
          <ActivityMetricsLineGraph data={item} key={index} />
        ))}
      </div>
    </>
  );
};

export default inject(({ dashboardStore }) => ({ dashboardStore }))(observer(ActivityMetrics));
