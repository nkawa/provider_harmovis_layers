import timelapseSettings, { TimeLapseState } from '../timelapseSettings';
import * as actions from '../../actions/timelapseActions';

const validateTime = (state: TimeLapseState): boolean => {
  if (state.startDate.getTime() > state.endDate.getTime()) {
    return false;
  }
  if (state.rangeEndDate.getTime() > state.endDate.getTime()) {
    return false;
  }
  if (state.rangeStartDate.getTime() > state.rangeEndDate.getTime()) {
    return false;
  }
  if (state.startDate.getTime() > state.rangeStartDate.getTime()) {
    return false;
  }
  if (state.selectedEndDate.getTime() > state.rangeEndDate.getTime()) {
    return false;
  }
  if (state.selectedStartDate.getTime() > state.selectedEndDate.getTime()) {
    return false;
  }
  if (state.rangeStartDate.getTime() > state.selectedStartDate.getTime()) {
    return false;
  }
  return true;
};

const setBoundedDate = () => {
  const start = new Date(Date.now() - 10 * 60 * 1000);
  const end = new Date();
  const state = timelapseSettings(
    undefined,
    actions.setBounded({
      start,
      end,
      lowerCorner: [0, 0],
      upperCorner: [0, 0]
    })
  );
  expect(start.getTime()).toEqual(state.startDate.getTime());
  expect(end.getTime()).toEqual(state.endDate.getTime());
  return state;
};

test('init state', () => {
  const state = timelapseSettings(undefined, { type: '' });
  expect(validateTime(state)).toBe(true);
});

test('set bounded state', () => {
  const state = setBoundedDate();
  expect(validateTime(state)).toBe(true);
});

test('set start rage date', () => {
  const st = setBoundedDate();
  const rangeStartDate = new Date(st.startDate.getTime() + 10);
  const state = timelapseSettings(
    st,
    actions.setRangeStartDate(rangeStartDate)
  );
  expect(validateTime(state)).toBe(true);
  expect(rangeStartDate.getTime()).toEqual(state.rangeStartDate.getTime());
});
test('can not set start rage date, range start date earlier than range end date', () => {
  const st = setBoundedDate();
  const rangeStartDate = new Date(st.startDate.getTime() - 100);
  const state = timelapseSettings(
    st,
    actions.setRangeStartDate(rangeStartDate)
  );
  expect(validateTime(state)).toBe(true);
  expect(rangeStartDate.getTime()).not.toEqual(state.rangeStartDate.getTime());
});
test('can not set start rage date, range start date later than range end date', () => {
  const st = setBoundedDate();
  const rangeStartDate = new Date(st.endDate.getTime() + 10);
  const state = timelapseSettings(
    st,
    actions.setRangeStartDate(rangeStartDate)
  );
  expect(validateTime(state)).toBe(true);
  expect(rangeStartDate.getTime()).not.toEqual(state.rangeStartDate.getTime());
});
test('can set end rage date', () => {
  let state = setBoundedDate();
  const rangeStartDate = state.startDate;
  const rangeEndDate = new Date(rangeStartDate.getTime() + 100);
  state = timelapseSettings(state, actions.setRangeStartDate(rangeStartDate));
  state = timelapseSettings(state, actions.setRangeEndDate(rangeEndDate));
  expect(validateTime(state)).toBe(true);
  expect(rangeStartDate.getTime()).toEqual(state.rangeStartDate.getTime());
  expect(rangeEndDate.getTime()).toEqual(state.rangeEndDate.getTime());
});
test('can not set end rage date', () => {
  let state = setBoundedDate();
  const rangeStartDate = state.startDate;
  const rangeEndDate = new Date(state.endDate.getTime() + 100);
  state = timelapseSettings(state, actions.setRangeStartDate(rangeStartDate));
  state = timelapseSettings(state, actions.setRangeEndDate(rangeEndDate));
  expect(validateTime(state)).toBe(true);
  expect(rangeStartDate.getTime()).toEqual(state.rangeStartDate.getTime());
  expect(rangeEndDate.getTime()).not.toEqual(state.rangeEndDate.getTime());
});
test('can not set end rage date', () => {
  let state = setBoundedDate();
  const rangeStartDate = state.startDate;
  const rangeEndDate = new Date(rangeStartDate.getTime() - 100);
  state = timelapseSettings(state, actions.setRangeStartDate(rangeStartDate));
  state = timelapseSettings(state, actions.setRangeEndDate(rangeEndDate));
  expect(validateTime(state)).toBe(true);
  expect(rangeStartDate.getTime()).toEqual(state.rangeStartDate.getTime());
  expect(rangeEndDate.getTime()).not.toEqual(state.rangeEndDate.getTime());
});

const setRangeDate = (state: TimeLapseState) => {
  const rangeStartDate = state.startDate;
  const rangeEndDate = new Date(rangeStartDate.getTime() + 10 * 1000);
  state = timelapseSettings(state, actions.setRangeStartDate(rangeStartDate));
  return timelapseSettings(state, actions.setRangeEndDate(rangeEndDate));
};

test('set selected start date', () => {
  let state = setBoundedDate();
  state = setRangeDate(state);
  const start = new Date(state.rangeStartDate.getTime() + 100);
  const end = new Date(start.getTime() + 500);
  state = timelapseSettings(state, actions.setSelectedStartDate(start));
  state = timelapseSettings(state, actions.setSelectedEndDate(end));
  expect(state.selectedStartDate.getTime()).toBe(start.getTime());
  expect(state.selectedEndDate.getTime()).toBe(end.getTime());

  const nextStart = new Date(start.getTime() + 100);
  state = timelapseSettings(state, actions.setSelectedStartDate(nextStart));
  expect(state.selectedStartDate.getTime()).toBe(nextStart.getTime());
  expect(state.selectedEndDate.getTime()).toBe(end.getTime() + 100);

  expect(validateTime(state)).toBe(true);
});

test('can not set selected start date, later than range end date', () => {
  let state = setBoundedDate();
  state = setRangeDate(state);
  const start = new Date(state.rangeStartDate.getTime() + 20 * 1000);
  state = timelapseSettings(state, actions.setSelectedStartDate(start));
  expect(state.selectedStartDate.getTime()).not.toBe(start.getTime());
  expect(validateTime(state)).toBeTruthy();
});

test('can not set selected end date, earlier than range start date', () => {
  let state = setBoundedDate();
  state = setRangeDate(state);
  const start = new Date(state.rangeStartDate.getTime() + 100);
  const end = new Date(start.getTime() - 1);
  state = timelapseSettings(state, actions.setSelectedStartDate(start));
  const resultEndDate = state.selectedEndDate;
  state = timelapseSettings(state, actions.setSelectedEndDate(end));
  expect(resultEndDate.getTime()).toBe(state.selectedEndDate.getTime());
  expect(end.getTime()).not.toBe(state.selectedEndDate.getTime());
  expect(validateTime(state)).toBeTruthy();
});
test('can not set selected end date, later than range end date', () => {
  let state = setBoundedDate();
  state = setRangeDate(state);
  const start = new Date(state.rangeStartDate.getTime() + 100);
  const end = new Date(state.rangeEndDate.getTime() + 1);
  state = timelapseSettings(state, actions.setSelectedStartDate(start));
  const resultEndDate = state.selectedEndDate;
  state = timelapseSettings(state, actions.setSelectedEndDate(end));
  expect(resultEndDate.getTime()).toBe(state.selectedEndDate.getTime());
  expect(end.getTime()).not.toBe(state.selectedEndDate.getTime());
  expect(validateTime(state)).toBeTruthy();
});
