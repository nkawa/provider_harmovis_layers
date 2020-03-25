import { isType } from 'typescript-fsa';
import { Action } from 'redux';
import * as actions from '../actions/timelapseActions';

export interface TimeLapseState {
  startDate: Date;
  endDate: Date;
  rangeStartDate: Date;
  rangeEndDate: Date;
  selectedStartDate: Date;
  selectedEndDate: Date;
  lowerCorner: number[];
  upperCorner: number[];
}

const defaultDuration = 2 * 60 * 60 * 1000; // 2 hour.
const defaultRange = 12 * 60 * 60 * 1000; // 12hour

const sd = new Date();
const initialState: TimeLapseState = {
  startDate: sd,
  endDate: new Date(sd.getTime() + defaultRange * 2),
  rangeStartDate: sd,
  rangeEndDate: new Date(sd.getTime() + defaultRange),
  selectedStartDate: sd,
  selectedEndDate: new Date(sd.getTime() + defaultDuration),
  lowerCorner: [],
  upperCorner: []
};

export default (state = initialState, action: Action): TimeLapseState => {
  if (isType(action, actions.setBounded)) {
    const {
      rangeStartDate,
      rangeEndDate,
      selectedStartDate,
      selectedEndDate
    } = state;
    const { payload } = action;
    const { start, end, lowerCorner, upperCorner } = payload;
    return {
      ...state,
      startDate: start,
      endDate: end,
      rangeStartDate:
        rangeStartDate.getTime() < start.getTime() ? start : rangeStartDate,
      rangeEndDate: rangeEndDate.getTime() > end.getTime() ? end : rangeEndDate,
      selectedStartDate:
        selectedStartDate.getTime() < start.getTime()
          ? start
          : selectedStartDate,
      selectedEndDate:
        selectedEndDate.getTime() > end.getTime() ? end : selectedEndDate,
      lowerCorner,
      upperCorner
    };
  }
  if (isType(action, actions.setRangeStartDate)) {
    const { payload } = action;
    const { rangeStartDate, rangeEndDate, startDate, endDate } = state;

    if (
      payload.getTime() < startDate.getTime() ||
      payload.getTime() > rangeEndDate.getTime()
    ) {
      return state;
    }
    const deltaRange = (() => {
      if (!rangeStartDate || !rangeEndDate) {
        return defaultRange;
      }
      return rangeEndDate.getTime() - rangeStartDate.getTime();
    })();
    const deltaSelected = (() => {
      if (!rangeStartDate || !rangeEndDate) {
        return defaultRange;
      }
      return rangeEndDate.getTime() - rangeStartDate.getTime();
    })();
    let newRangeEndDate = new Date(payload.getTime() + deltaRange);
    if (newRangeEndDate.getTime() > endDate.getTime()) {
      newRangeEndDate = endDate;
    }
    let newSelectedEndDate = new Date(payload.getTime() + defaultDuration);
    if (newSelectedEndDate.getTime() > newRangeEndDate.getTime()) {
      newSelectedEndDate = newRangeEndDate;
    }
    return {
      ...state,
      rangeStartDate: payload,
      rangeEndDate: newRangeEndDate,
      selectedStartDate: payload,
      selectedEndDate: newSelectedEndDate
    };
  }
  if (isType(action, actions.setRangeEndDate)) {
    const { payload } = action;
    const { rangeStartDate, endDate } = state;
    if (
      payload.getTime() > rangeStartDate.getTime() &&
      payload.getTime() < endDate.getTime()
    ) {
      return {
        ...state,
        rangeEndDate: payload
      };
    }
  }
  if (isType(action, actions.setSelectedStartDate)) {
    const { payload } = action;
    const { selectedStartDate, selectedEndDate, rangeEndDate } = state;

    if (payload.getTime() > rangeEndDate.getTime()) {
      return state;
    }
    const delta = (() => {
      if (!selectedStartDate || !selectedEndDate) {
        return defaultDuration;
      }
      return selectedEndDate.getTime() - selectedStartDate.getTime();
    })();
    let endDate = new Date(payload.getTime() + delta);
    if (endDate.getTime() > rangeEndDate.getTime()) {
      endDate = rangeEndDate;
    }
    return {
      ...state,
      selectedStartDate: payload,
      selectedEndDate: endDate
    };
  }
  if (isType(action, actions.setSelectedEndDate)) {
    const { selectedStartDate, rangeEndDate } = state;
    const { payload } = action;
    if (
      payload.getTime() > selectedStartDate.getTime() &&
      payload.getTime() <= rangeEndDate.getTime()
    ) {
      return {
        ...state,
        selectedEndDate: payload
      };
    }
  }
  return state;
};
