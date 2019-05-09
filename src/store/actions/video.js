import {createAction,createRequestTypes,REQUEST,SUCCESS,FAILURE} from './index'

export const MOST_POPULAR = createRequestTypes('MOST_POPULAR')
export const mostPopular = {
    request:(amount,loadDescription,nextPageToken)=>createAction(MOST_POPULAR[REQUEST],{amount,loadDescription,nextPageToken}),
    success:(response)=>createAction(MOST_POPULAR[SUCCESS],{response}),
    failure:(response)=>createAction(MOST_POPULAR[FAILURE],{response})
}

export const VIDEO_CATEGORIES = createRequestTypes('VIDEO_CATEGORIES');
export const categories = {
  request: () => createAction(VIDEO_CATEGORIES[REQUEST]),
  success: (response) => createAction(VIDEO_CATEGORIES[SUCCESS], {response}),
  failure: (response) => createAction(VIDEO_CATEGORIES[FAILURE], {response}),
};

export const MOST_POPULAR_BY_CATEGORY = createRequestTypes('MOST_POPULAR_BY_CATEGORY');
export const mostPopularByCategory = {
  request: (categories) => createAction(MOST_POPULAR_BY_CATEGORY[REQUEST], {categories}),
  success: (response, categories) => createAction(MOST_POPULAR_BY_CATEGORY[SUCCESS], {response, categories}),
  failure: (response) => createAction(MOST_POPULAR_BY_CATEGORY[FAILURE], response),
};

//we create actions to fetch more detailed data for the video
//these are used to just define the action types and the data that they will return 
//to the reducer 

export const WATCH_DETAILS = createRequestTypes('WATCH_DETAILS')
export const details={
    request:(videoId)=>createAction(WATCH_DETAILS[REQUEST],{videoId}),
    success:(videoId,response)=>createAction(WATCH_DETAILS[SUCCESS],{response}),
    failure:(videoId,response)=>createAction(WATCH_DETAILS[FAILURE],{response})
}

//this will fetch additional related videos 
// Since our video details request is a chained network request, it will not be triggered by a direct user action, that’s why we throw an error in the request filed of it. Apart from that, we provide both a success and failure function which dispatch a VIDEO_DETAILS_SUCCESS / VIDEO_DETAILS_FAILURE action once we got the result
export const VIDEO_DETAILS = createRequestTypes('VIDEO_DETAILS')
export const videoDetails={
  request:()=>{
    throw Error('not implemented')
  },
  success:(response)=>createAction(VIDEO_DETAILS[SUCCESS],{response}),
  failure:(response)=>createAction(VIDEO_DETAILS[FAILURE],{response})
}