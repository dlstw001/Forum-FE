import { dateFormat, getTopicUrl, scrollTo } from 'utils';
import { debounce, first, last } from 'lodash';
import { inject, observer } from 'mobx-react';
import { useHistory, useRouteMatch } from 'react-router';
import React from 'react';
import ReactSlider from 'react-slider';

const Timeline = ({ store, replyStore, urlGenerator = getTopicUrl, post, id, invert }) => {
  const history = useHistory();
  const [replies, setReplies] = React.useState();
  const [timeline, setTimeline] = React.useState();
  const [val, setVal] = React.useState();
  // const timerRef = React.useRef();
  const {
    params: { replyNo },
  } = useRouteMatch();

  const index = React.useMemo(() => replies?.map((i) => i.replyNo), [replies]);

  const getData = React.useCallback(() => {
    if (id) {
      replyStore.replyIndex(id);
    }
  }, [id, replyStore]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  React.useEffect(() => {
    const index = replyStore.index;
    setReplies(index);
    const current = index.find((i) => i.replyNo === parseInt(replyNo));
    setTimeline({ first: first(index), current, last: last(index) });
  }, [replyNo, replyStore.index]);

  // React.useEffect(() => {
  //   setTimeout(() => {
  //     timerRef.current = true;
  //   }, 3000);
  // }, [replyNo]);

  React.useEffect(() => {
    const value = store.replyNo;
    if (
      post.slug
      //  && timerRef.current
    ) {
      if (value) {
        const current = replies?.find((i) => i.replyNo === parseInt(value));
        setTimeline((prevState) => ({ ...prevState, current }));
        window.history.replaceState(null, '', `${urlGenerator(post, value)}${window.location.search}`);
      } else {
        setTimeline((prevState) => ({ ...prevState, current: {} }));
        window.history.replaceState(null, '', `${urlGenerator(post)}${window.location.search}`);
      }
    }
  }, [post, replies, store.replyNo, urlGenerator]);

  const handleChange = (idx) => {
    const value = index[idx - 1];
    store.replyNo = value;
    // timerRef.current = false;
    const reply = document.querySelector(`[replyno="${value}"]`)?.querySelector('div');
    if (reply) {
      scrollTo(reply);
    } else {
      history.replace({
        pathname: urlGenerator(post, value),
        ...(window.location.search && { search: window.location.search }),
      });
    }
  };

  const value = React.useMemo(() => {
    return timeline?.current?.replyNo
      ? index.indexOf(timeline?.current?.replyNo) + 1
      : invert
      ? timeline?.last?.replyNo
      : 1;
  }, [index, invert, timeline]);

  const debounceRef = React.useRef(
    debounce((newValue) => {
      setVal(newValue);
    }, 100)
  );

  React.useEffect(() => {
    debounceRef.current(value);
  }, [value]);

  return (
    <div className="text-center">
      {timeline?.last && (
        <>
          <button onClick={() => handleChange(invert ? timeline.last.replyNo : timeline.first.replyNo)}>
            {dateFormat(invert ? timeline.last?.createdAt : timeline.first?.createdAt, 'MMM yyyy')}
          </button>
          <ReactSlider
            max={replies?.length}
            className="vertical-slider"
            markClassName="timeline-mark"
            thumbClassName="timeline-thumb"
            trackClassName="timeline-track"
            value={val}
            invert={invert}
            marks={10}
            ariaLabel={['Lowest thumb', 'Middle thumb', 'Top thumb']}
            renderThumb={(props, state) => (
              <div {...props}>
                <strong className="block">
                  {state.valueNow} / {replies?.length}
                </strong>
                {dateFormat(replies.find((i) => i.replyNo === state.valueNow)?.createdAt, 'MMM yyyy')}
              </div>
            )}
            orientation="vertical"
            pearling
            minDistance={10}
            onAfterChange={handleChange}
          />
          <button onClick={() => handleChange(invert ? timeline.first.replyNo : timeline.last.replyNo)}>
            {dateFormat(invert ? timeline.first?.createdAt : timeline.last?.createdAt, 'MMM yyyy')}
          </button>
        </>
      )}
    </div>
  );
};

export default inject(({ replyStore }) => ({ replyStore }))(observer(Timeline));
