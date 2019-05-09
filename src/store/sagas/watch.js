//In this fiel we do all the saga related operations for getting 
//data for a particular video 

//to reach out to the endpoint for getting detailed video data 
//we need to create a watcher saga that forks a worker saga when it detects WATCH_DETAILS event

import {fork,take, call,put,all} from 'redux-saga/effects'
import * as watchActions from '../actions/video'
import {REQUEST} from '../actions'
import { buildVideoDetailRequest,buildRelatedVideosRequest, buildChannelRequest } from '../api/youtube-api';
import { SEARCH_LIST_RESPONSE,VIDEO_LIST_RESPONSE } from '../api/youtube-response-types';

//here we listen to the WATCHER_DETAILS_REQUEST action type and extract the videoId param from it 
//and then fork a worker saga and pass along the videoId
export function* watchWatchDetails(){
    while(true){
        const {videoId} = yield take(watchActions.WATCH_DETAILS[REQUEST])
        yield fork(fetchWatchDetails,videoId)
    }
}

//we need to make multiple requests
// we first call the buildVideoDetailRequest to gte the req that we 
// defined in the api file and for each we will call
//yield all which is same as promise.all to perform all 
//the req parallely 
//once done we dispatch the action WATCH_DETAILS_SUCCESS using watchDeatials.details.sucess(resposnes)
//if fail we dispatch another action WATCH_DETAILS_FAILURE
//here we are firing one more req to get the related videos as well
export function* fetchWatchDetails(videoId,channelId) {
    let requests = [
      buildVideoDetailRequest.bind(null, videoId),
      buildRelatedVideosRequest.bind(null, videoId),
    ];
  
    if(channelId){
      requests.push(buildChannelRequest.bind(null,channelId))
    }

    try {
      const responses = yield all(requests.map(fn => call(fn)));
      yield put(watchActions.details.success(responses));
      yield call (fetchVideoDetails, responses,channelId === null);
    } catch (error) {
      yield put(watchActions.details.failure(error));
    }
  }
//function to create consecutive network requests:
//after we have therelated video ids we create a new video detail request for each id 
//once we get the response we fire the success action if we fail we dispatcht the failure action
function* fetchVideoDetails(responses,shouldFetchChannelInfo) {
    const searchListResponse = responses.find(response => response.result.kind === SEARCH_LIST_RESPONSE);
    const relatedVideoIds =  searchListResponse.result.items.map(relatedVideo => relatedVideo.id.videoId);
  
    const requests = relatedVideoIds.map(relatedVideoId => {
      return buildVideoDetailRequest.bind(null, relatedVideoId);
    });

    if(shouldFetchChannelInfo){
    // we have to extract the video's channel id from the video details response
    // so we can load additional channel information.
    // this is only needed, when a user directly accesses .../watch?v=1234
    // because then we only know the video id
    const videoDetailResponse = responses.find(response=>response.result.kind === VIDEO_LIST_RESPONSE)
    const videos = videoDetailResponse.result.items
    if(videos && videos.length){
      requests.push(buildChannelRequest.bind(null,videos[0].snippet.channelId))
    }
    }
  
    try {
      const responses = yield all(requests.map(fn => call(fn)));
      yield put(watchActions.videoDetails.success(responses));
    } catch (error) {
      yield put(watchActions.videoDetails.failure(error));
    }
  }

