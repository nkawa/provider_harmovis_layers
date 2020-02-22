import { getCombinedReducer } from 'harmoware-vis'
import { createStore, applyMiddleware } from 'redux'
import heatmapSettings from './reducer/heatmapSettings'
import barGraphSettings from './reducer/barGraphSettings'

import createSagaMiddleware from 'redux-saga'

const saga = createSagaMiddleware()

const store = createStore(
	getCombinedReducer({
  heatmapSettings,
  barGraphSettings,
}),
	applyMiddleware(saga)
)

export default store;
