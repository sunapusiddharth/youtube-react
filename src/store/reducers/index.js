import apiReducer from './api'
import {combineReducers} from 'redux'
import videos from './videos'

export default combineReducers({
  api:apiReducer,
  videos:videos
})