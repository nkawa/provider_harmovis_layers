import actionCreatorFactory from 'typescript-fsa'
import * as types from '../constants/actionTypes'
import { GridType } from '../constants/MapSettings'

const actionCreator = actionCreatorFactory()

export const setHeatmapRadius = actionCreator<number>(types.SET_HEATMAP_SIZE)
export const setHeatmapHeight = actionCreator<number>(types.SET_HEATMAP_HEIGHT)
export const setParticleCount = actionCreator<number>(types.SET_PARTICLE_COUNT)
export const toggleHeatmap = actionCreator<boolean>(types.TOGGLE_HEATMAP)
export const selectHeatmapType = actionCreator<GridType>(types.CHANGE_HEATMAP_TYPE)
export const extrudeHeatmap = actionCreator<boolean>(types.EXTRUDE_HEATMAP)
