import actionCreatorFactory from 'typescript-fsa'

const actionCreator = actionCreatorFactory();
export interface Bounded {
  start: Date;
  end: Date;
  lowerCorner: number[];
  upperCorner: number[];
}

export const setBounded = actionCreator<Bounded>('SET_BOUNDED');
export const sweeping = actionCreator<boolean>('SWEEPING');
export const demandBounded = actionCreator<void>('DEMAND_BOUNDED');
export const changeBeginPosition = actionCreator<Date>('CHANGE_BEGIN_POSITION');
export const fetchInitialData = actionCreator<void>('FETCH_INITIAL_DATA');
export const fetchMovingFeatures = actionCreator<void>('FETCH_MOVING_FEATURES');
export const setRangeDate = actionCreator<{ start: Date; end: Date }>(
  'SET_RANGE_DATE'
);
export const setRangeStartDate = actionCreator<Date>('SET_RANGE_START_DATE');
export const setRangeEndDate = actionCreator<Date>('SET_RANGE_END_DATE');
export const setSelectedStartDate = actionCreator<Date>(
  'SET_SELECTED_START_DATE'
);
export const setSelectedEndDate = actionCreator<Date>('SET_SELECTED_END_DATE');
