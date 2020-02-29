import { isType } from 'typescript-fsa'
import { Action } from 'redux'
import * as actions from '../actions/actions'
import { BalloonInfo } from '../constants/informationBalloon'

export interface InformationBalloonState {
    infoBalloonList: BalloonInfo[]
}

const initialState: InformationBalloonState  = {
    infoBalloonList: [{
      id: 'zz',
      position: [136.743642, 34.955052],
      title: 'test',
      items: [
        'テストだよ'
      ]
    }]
}

export default (state = initialState, action: Action): InformationBalloonState => {
  if (isType(action, actions.appendBallonInfo)) {
    const info = action.payload
    return {
      ...state,
      infoBalloonList: state.infoBalloonList.slice().concat(info)
    }
  }
  if (isType(action, actions.removeBallonInfo)) {
    const id = action.payload
    return {
      ...state,
      infoBalloonList: state.infoBalloonList.filter(b => b.id !== id)
    }
  }
  if (isType(action, actions.updateBallonInfo)) {
    const info = action.payload
    const data = state.infoBalloonList.find(b => b.id !== info.id)
    if (data) {
      data.items = info.items;
      data.title = info.title;
      data.position = data.position;
      return {
        ...state
      }
    }

  }
  return state
}
