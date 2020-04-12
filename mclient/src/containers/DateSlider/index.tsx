import React from 'react';
import 'rc-slider/assets/index.css';
import { Range, createSliderWithTooltip } from 'rc-slider';
import { useSelector, useDispatch } from 'react-redux';
import { TimeLapseState } from '../../reducer/timelapseSettings';
import * as actions from '../../actions/timelapseActions';
import './datePicker.scss';

const dateString = (date: Date): string => {
  const tzoffset = new Date().getTimezoneOffset() * 60000;
  const dateStr = new Date(date.getTime() - tzoffset).toISOString();
  const result = dateStr.split('.')[0];
  return result;
};

const formatTime = (time: number) => {
  const date = new Date(time);
  return `${date.getFullYear()}/${date.getMonth() +
    1}/${date.getDate()}/${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

interface Props {
  settime: number;
  setCurrentTime: Function;
}

const dotted: React.CSSProperties = {
  borderTop: '10px dotted #fff',
  borderRight: 'none',
  borderLeft: 'none',
  borderBottom: 'none'
};

const sideComponent: React.CSSProperties = {
  width: '15%',
  display: 'flex',
  flexDirection: 'column'
};
const mainComponent: React.CSSProperties = {
  width: '70%',
  display: 'flex',
  flexDirection: 'column'
};

const TipRange = createSliderWithTooltip(Range);
const DatePicker: React.FC<Props> = prop => {
  const { settime, setCurrentTime } = prop;
  const {
    startDate,
    endDate,
    selectedStartDate,
    selectedEndDate,
    rangeStartDate,
    rangeEndDate
  } = useSelector<any, TimeLapseState>(st => {
    return st.timelapseSettings;
  });
  const dispatcher = useDispatch();
  const onChangeRangeStartDateHandler = (
    ev: React.ChangeEvent<HTMLInputElement>
  ) => {
    const date = new Date(ev.currentTarget.value);
    debugger;
    dispatcher(actions.setRangeStartDate(date));
  };
  const onChangeRangeEndDateHandler = (
    ev: React.ChangeEvent<HTMLInputElement>
  ) => {
    const date = new Date(ev.currentTarget.value);
    dispatcher(actions.setRangeEndDate(date));
  };

  const onChangedRange = () => {
    console.log('on changed range');
    dispatcher(actions.fetchMovingFeatures());
  };
  const onChangeRange = (positions: number[]) => {
    const startTime = positions[0];
    // const current = positions[1];
    const endTime = positions[2];
    dispatcher(actions.sweeping(true));
    if (selectedStartDate.getTime() !== startTime) {
      dispatcher(actions.setSelectedStartDate(new Date(startTime)));
    }
    if (selectedEndDate.getTime() !== endTime) {
      console.log(new Date(endTime));
      dispatcher(actions.setSelectedEndDate(new Date(endTime)));
    }
  };
  if (!selectedStartDate || !selectedEndDate) {
    return <div> initializing </div>;
  }

  const tipFormatter = (value: number) => dateString(new Date(value));
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <div
          style={sideComponent}
        >
          <div>
            <span className="p-left arrow-left-down">
              {formatTime(startDate.getTime())}
            </span>
          </div>
          <div>
            <hr style={dotted} />
          </div>
        </div>
        <div
          style={mainComponent}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div className="p-left arrow-left-down">
              <input
                type="datetime-local"
                min={dateString(startDate)}
                max={dateString(rangeEndDate)}
                value={dateString(rangeStartDate)}
                onInput={onChangeRangeStartDateHandler}
                onChange={onChangeRangeStartDateHandler}
              />
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              time:
              {formatTime(settime * 1000)}
            </div>
            <div className="p-right arrow-right-down">
              <input
                type="datetime-local"
                min={dateString(rangeStartDate)}
                max={dateString(endDate)}
                value={dateString(rangeEndDate)}
                onInput={onChangeRangeEndDateHandler}
                onChange={onChangeRangeEndDateHandler}
              />
            </div>
          </div>
          <div style={{ width: '100%' }}>
            <TipRange
              min={rangeStartDate.getTime()}
              max={rangeEndDate.getTime()}
              count={3}
              tipFormatter={tipFormatter}
              onAfterChange={onChangedRange}
              onChange={onChangeRange}
              value={[
                selectedStartDate.getTime(),
                settime,
                selectedEndDate.getTime()
              ]}
            />
          </div>
        </div>
        <div
          style={sideComponent}
        >
          <div
            style={{
              textAlign: 'right'
            }}
          >
            <span className="p-right arrow-right-down">
              {formatTime(endDate.getTime())}
            </span>
          </div>
          <div>
            <hr style={dotted} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DatePicker);
