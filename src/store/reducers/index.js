import apiReducer from './api'
import {combineReducers} from 'redux'
import videos from './videos'
import channelsReducer from './channels';

export default combineReducers({
  api:apiReducer,
  videos:videos,
  channels: channelsReducer,
})