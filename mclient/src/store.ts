import { getCombinedReducer } from 'harmoware-vis'
import { createStore, applyMiddleware } from 'redux'
import heatmapSettings from './reducer/heatmapSettings'
import barGraphSettings from './reducer/barGraphSettings'
import createSagaMiddleware from 'redux-saga'
import informationBalloon from './reducer/informationBalloon'

const saga = createSagaMiddleware()

const store = createStore(
	getCombinedReducer({
  heatmapSettings,
  barGraphSettings,
  informationBalloon,
}),
	applyMiddleware(saga)
)

export default store;
