import {VIDEO_DETAILS, WATCH_DETAILS} from '../actions/watch';
import {SUCCESS} from '../actions';
import {CHANNEL_LIST_RESPONSE} from '../api/youtube-response-types';

/*
And here’s the interesting thing. Even though we are now in a different “sub” reducer, we can react to all events that are dispatched. This means that multiple “sub” reducers can react to the same event and update their respective part of the state. This means that when we get the WATCH_DETAILS success action, our videos “sub” reducer will extract the video details and the related videos from the responses. The videos reducer does not care about the channel information.

At the same time, our channel reducer ignores the video details and the related videos and just extracts the channel information.

This is a very important paradigm. Like so, we can have a really clean state and a clear separation of concerns while bundling together requests in one action.
*/


const initialState={
    byId:{}
}

export default function (state = initialState, action) {
    switch (action.type) {
      case WATCH_DETAILS[SUCCESS]:
        return reduceWatchDetails(action.response, state);
        case VIDEO_DETAILS[SUCCESS]:
        return reduceVideoDetails(action.response,state)
      default:
        return state;
    }
  }

//this fucntion is used to extract data of channelfrom the requests
function reduceWatchDetails(responses, prevState) {
    const channelResponse = responses.find(response => response.result.kind === CHANNEL_LIST_RESPONSE);
    let channels = {};
    if (channelResponse && channelResponse.result.items) {
      // we know that there will only be one item
      // because we ask for a channel with a specific id
      const channel = channelResponse.result.items[0];
      channels[channel.id] = channel;
    }
    return {
      ...prevState,
      byId: {
        ...prevState.byId,
        ...channels
      }
    };
  }

  function reduceVideoDetails(responses,prevState){
      const channelResponse = responses.find(response=>response.result.kind === CHANNEL_LIST_RESPONSE)
      let channelEntry = {}
      if(channelResponse && channelResponse.result.items){
        // we're explicitly asking for a channel with a particular id
        // so the response set must either contain 0 items (if a channel with the specified id does not exist)
        // or at most one item (i.e. the channel we've been asking for)
        const channel = channelResponse.result.items[0]
        channelEntry={
            [channel.id]:channel
        }
      }
      return {
          ...prevState,
          byId:{
              ...prevState,
              ...channelEntry
          }
      }
  }

  ///creating a selector for chaannels :
  export const getChannel = (state,channelId)=>{
      if(!channelId) return null
      return state.channels.byId[channelId]
  }