import { isType } from 'typescript-fsa'
import { Action } from 'redux'
import * as actions from '../actions/actions'
import { BarData } from '../constants/bargraph'

export interface BarGraphState {
  heightRatio: number
  widthRatio: number
  radiusRatio: number;
  selectedBarData: BarData|null; 
  titlePosOffset: number; 
}

const initialState: BarGraphState  = {
  heightRatio: 100,
  widthRatio: 1,
  radiusRatio: 1,
  selectedBarData: null,
  titlePosOffset: 50,
}

export default (state = initialState, action: Action): BarGraphState => {
  if (isType(action, actions.selectBarGraph)) {
    return {
      ...state,
      selectedBarData: action.payload
    }
  }
  if (isType(action, actions.changeBarTitlePosOffset)) {
    return {
      ...state,
      titlePosOffset: action.payload
    }
  }
  if (isType(action, actions.changeBarHeight)) {
    return {
      ...state,
      heightRatio: action.payload
    }
  }
  if (isType(action, actions.changeBarRadius)) {
    return {
      ...state,
      radiusRatio: action.payload
    }
  }
  if (isType(action, actions.changeBarWidth)) {
    return {
      ...state,
      widthRatio: action.payload
    }
  }
  return state
}
