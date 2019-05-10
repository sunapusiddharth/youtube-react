import apiReducer from './api'
import {combineReducers} from 'redux'
import videos from './videos'
import channelsReducer from './channels';
import commentReducer from './comment'
import searchReducer from './search'

export default combineReducers({
  api:apiReducer,
  videos:videos,
  channels: channelsReducer,
  comments:commentReducer,
  search:searchReducer
})