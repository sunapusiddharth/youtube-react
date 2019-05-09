import apiReducer from './api'
import {combineReducers} from 'redux'
import videos from './videos'
import channelsReducer from './channels';
import commentReducer from './comment'

export default combineReducers({
  api:apiReducer,
  videos:videos,
  channels: channelsReducer,
  comments:commentReducer
})