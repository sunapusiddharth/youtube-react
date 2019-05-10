import {MOST_POPULAR, VIDEO_CATEGORIES,MOST_POPULAR_BY_CATEGORY} from '../actions/video'
import {VIDEO_DETAILS,WATCH_DETAILS} from '../actions/watch';
import {SUCCESS} from '../actions'
import {createSelector} from 'reselect'
import {WA} from '../actions/video'
import {VIDEO_LIST_RESPONSE,SEARCH_LIST_RESPONSE} from '../api/youtube-response-types'
import { getSearchParam } from '../../services/url';

const initialState = {
    byId:{},
    mostPopular:{},
    categories:{},
    byCategory:{},
    related:{}
}

//selectors :
/*
The createSelector function is variadic function, i.e. it accepts an arbitrary amount of parameters. Say the createSelector function has n parameters, then the first n - 1 parameters are functions that get a particular part of our global Redux state. The function's last argument is the function that actually computes the derived state. The function's return value is cached.

To return an array of the most popular videos, we need to access two parts of our global state. First of all, we need our big “video dictionary” where we store the details of each video. This is what the first function in the createSelector’s argument list is returning. Second, we need to get the the video ids that correspond to the most popular videos. We can do that by accessing state.mostPopular.

Finally we can compute our array by joining our two objects together

So to sum up: our selector will depend on two parts of the state, that is state.videos.byId and state.videos.mostPopular. As soon as at least one of them gets updated, reselect will re evaluate the function that computes the derived part of the state. In our case we return an array of the most popular videos.
*/
export const getMostPopularVideos = createSelector(
    (state)=>state.videos.byId,
    (state)=>state.videos.mostPopular,
    (videosById,mostPopular)=>{
        if(!mostPopular || !mostPopular.items){
            return []
        }
        return mostPopular.items.map(videoId=>videosById[videoId])
    }
)

export const getVideoVategories = createSelector(
    state=>state.videos.categories,
    (categories)=>{
        return Object.keys(categories|| {})
    }
)

export default function videos(state = initialState, action) {
    switch (action.type) {
      case MOST_POPULAR[SUCCESS]:
        return reduceFetchMostPopularVideos(action.response, state);
      case VIDEO_CATEGORIES[SUCCESS]:
        return reduceFetchVideoCategories(action.response, state);
      case MOST_POPULAR_BY_CATEGORY[SUCCESS]:
        return reduceFetchMostPopularVideosByCategory(action.response, action.categories, state);
        case WATCH_DETAILS[SUCCESS]:
        console.log('from reduce switch',action)
        return reduceWatchDetails(action.response,state)
        case VIDEO_DETAILS[SUCCESS]:
      return reduceVideoDetails(action.response, state);
      default:
        return state;
    }
  }


function reduceFetchMostPopularVideos(response,prevState){
    const videoMap = response.items.reduce((accumulator,video)=>{
        accumulator[video.id]  = video;
        return accumulator
    },{})
    let items = Object.keys(videoMap)
    if(response.hasOwnProperty('prevPageToken') && prevState.mostPopular){
        items = [...prevState.mostPopular.items,...items]
    }

    const mostPopular = {
        totalResults:response.pageInfo.totalResults,
        nextPageToken:response.nextPageToken,
        items,
    }

    return{
        ...prevState,
        mostPopular,
        byId:{...prevState.byId,...videoMap}
    }
}

function reduceFetchVideoCategories(response, prevState) {
    const categoryMapping = response.items.reduce((accumulator, category) => {
      accumulator[category.id] = category.snippet.title;
      return accumulator;
    }, {});
    return {
      ...prevState,
      categories: categoryMapping,
    };
  }


/*
Remember that we fetch the most popular videos for multiple categories concurrently. Therefore, our response is actually an array of responses. If we fire n requests, we get n responses back.

There is two things we need to do in our reducer. We need to update our videos.byId object because we just received new information about new videos. In addition, we must store to which video category the freshly fetched videos belong to.

At the very beginning we declare the videoMap and the byCategoryMap variable. The videoMap variable will later be merged into our videos.byId object and associates each video id with the respective video. The byCategories is later used to update the videos.byCategory state and stores the total amount of results, the next page token and an items array with video ids.

We iterate over all responses and first check if the Youtube endpoint returned an error. If we got an error back, we just ignore it and continue with the next response.

In case we actually got some data back, we call a function we have yet to define called groupVideosByIdAndCatgory. This function returns an object that contains a small video “dictionary” (byId) and an object that contains the content that should later go into the videos.byCategory object.
*/
function reduceFetchMostPopularVideosByCategory(responses, categories, prevState) {
    let videoMap = {};
    let byCategoryMap = {};
  
    responses.forEach((response, index) => {
      // ignore answer if there was an error
      if (response.status === 400) return;
  
      const categoryId = categories[index];
      const {byId, byCategory} = groupVideosByIdAndCategory(response.result);
      videoMap = {...videoMap, ...byId};
      byCategoryMap[categoryId] = byCategory;
    });
  
    // compute new state
    return {
      ...prevState,
      byId: {...prevState.byId, ...videoMap},
      byCategory: {...prevState.byCategory, ...byCategoryMap},
    };
  }

/*
Remember that each entry inside our global videos.byCategory state is an object that contains the total results, the next page token and an array with video ids. As a first step, we can extract the total amount of results and the next page token. Then we only have to take care of the video ids.

Our approach is the exact same as in the reduceFetchMostPopularVideosByCategory function. We have a byId object and a byCategory object. Our byId object serves as a little “dictionary” where we associate a video id with the actual video object.

We iterate over each video and add an entry in our byId “dictionary”. Should we already have some elements in the items array of our byCategory object, we just append the current video id. If not, we create an array with the current video id.

Note that we are using a rather iterative style here so we don’t have to create new objects all the time.

Again, it might make sense to step through this code in the debugger because it is not easy to understand 🤓. The transformation we do is complex after all.
*/
function groupVideosByIdAndCategory(response) {
    const videos = response.items;
    const byId = {};
    const byCategory = {
      totalResults: response.pageInfo.totalResults,
      nextPageToken: response.nextPageToken,
      items: [],
    };
  
    videos.forEach((video) => {
      byId[video.id] = video;
  
      const items = byCategory.items;
      if(items && items) {
        items.push(video.id);
      } else {
        byCategory.items = [video.id];
      }
    });
  
    return {byId, byCategory};
  }

export const getVideoCategoryIds = createSelector(
    state => state.videos.categories,
    (categories) => {
      return Object.keys(categories || {});
    }
  );
//redux selector :
/*
Our new selector depends on three objects inside state.videos. We need to know which video ids are associated with a particular category. That’s why we depend on state.videos.byCategory. We also depend on our big “dictionary” which associates a video’s id with the actual object. Therefore, we need state.videos.byId. Of course, we also need to know the available video categories and so we depend on state.videos.categories.

First, we pick the video category ids and iterate over them. We first get the video ids for one specific category by videosByCategory[categoryId].items.

Next we get the title associated with a specific category id. Finally, we associate a category's title with an array of videos
*/

export const getVideosByCategory = createSelector(
    state => state.videos.byCategory,
    state => state.videos.byId,
    state => state.videos.categories,
    (videosByCategory, videosById, categories) => {
      return Object.keys(videosByCategory || {}).reduce((accumulator, categoryId) => {
        const videoIds = videosByCategory[categoryId].items;
        const categoryTitle = categories[categoryId];
        accumulator[categoryTitle] = videoIds.map(videoId => videosById[videoId]);
        return accumulator;
      }, {});
    }
  );

// used for showing spinner 
export const videoCategoriesLoaded = createSelector(
    state => state.videos.categories,
    (categories) => {
      return Object.keys(categories || {}).length !== 0;
    }
  );

  export const videosByCategoryLoaded = createSelector(
    state => state.videos.byCategory,
    (videosByCategory) => {
      return Object.keys(videosByCategory || {}).length;
    }
  );


  //for the detailed data for the single video component
  //items array in the videos will contain all the data about video
  //
  function reduceWatchDetails(responses, prevState) {
    const videoDetailResponse = responses.find(r => r.result.kind === VIDEO_LIST_RESPONSE);
    // we know that items will only have one element
    // because we explicitly asked for a video with a specific id
    const video = videoDetailResponse.result.items[0];
    const relatedEntry = reduceRelatedVideosRequest(responses);
  
    return {
      ...prevState,
      byId: {
        ...prevState.byId,
        [video.id]: video
      },
      related: {
        ...prevState.related,
        [video.id]: relatedEntry
      }
    };
  }

  //to get the videoi id this will act as a selector 
  export const getVideoById = (state,videoId)=>{
    console.log('sidhu567',state.videos.byId[videoId])
    return state.videos.byId[videoId]
  }
  
  function reduceRelatedVideosRequest(responses) {
    const relatedVideosResponse = responses.find(r => r.result.kind === SEARCH_LIST_RESPONSE)
    const {pageInfo, items, nextPageToken} = relatedVideosResponse.result
    const relatedVideoIds = items.map(video => video.id.videoId)
  
    return  {
      totalResults: pageInfo.totalResults,
      nextPageToken,
      items: relatedVideoIds
    };
  }

  function reduceVideoDetails(responses, prevState) {
    const videoResponses = responses.filter(response => response.result.kind === VIDEO_LIST_RESPONSE);
    const parsedVideos = videoResponses.reduce((videoMap, response) => {
        // we're explicitly asking for a video with a particular id
        // so the response set must either contain 0 items (if a video with the id does not exist)
        // or at most one item (i.e. the channel we've been asking for)
        const video = response.result.items ? response.result.items[0] : null;
        if (!video) {
          return videoMap;
        }
        videoMap[video.id] = video;
        return videoMap;
      }, {});
  
    return {
      ...prevState,
      byId: {...prevState.byId, ...parsedVideos},
    };
  }

  //selector for related videos section:
  //   We create a little helper function getRelatedVideoIds which returns the related video ids for a specific video. We just a ternary expression here to be safe in case we don’t have a related object for a particular video id yet.
  // After that, we create our selector where we iterate over the related video ids and pick the appropriate video from our state.video.byId dictionary.
  // Theoretically there could be a case where we know the related video id but where we haven’t loaded the video yet.
  // Therefore, we append a filter(video => video) expression which kicks out all null values in the array we return.

  const getRelatedVideoIds = (state,videoId)=>{
    console.log("from here",state.videos.related)
    const related = state.videos.related[videoId]
    return related ? related.items:[]
  }
 
  export const getRelatedVideos = createSelector(
    getRelatedVideoIds,
    state => state.videos.byId,
    (relatedVideoIds, videos) => {
      if (relatedVideoIds) {
        // filter kicks out null values we might have
        return relatedVideoIds.map(videoId => videos[videoId]).filter(video => video);
      }
      return [];
    });
  

    //selectore for channel 
    //we get the videoId from URL and search for video in our state.videosByid 
    export const getChannelId = (state, location, name) => {
      const videoId = getSearchParam(location, name);
      const video = state.videos.byId[videoId];
      if (video) {
        return video.snippet.channelId;
      }
      return null;
    };



    //selector for total amount of comments :
    export const getAmountComments = createSelector(
      getVideoById,
      (video)=>{
        if(video){
          return video.statistics.commentCount
        }
        return 0
      }
    )


    //selector for infinite scrolling of Trending videos:
    //this selector will return the nextPageToken to the action creator 
    const getMostPopular = (state)=>state.videos.mostPopular
    //in the selector we depend on the getMostPopular and then we return the nextPage token from it 
    export const getMostPopularVideosNextPageToken = createSelector(
      getMostPopular,
      (mostPopular)=>{
        return mostPopular.nextPageToken
      }
    )

    //selector to check how many available videos are present 
    //we keep track of total no of items in global state 
    export const allMostPopularVideosLoaded = createSelector(
      [getMostPopular],
      (mostPopular)=>{
        const amountFetchedItems = mostPopular.items ? mostPopular.items.length:0
        return amountFetchedItems === mostPopular.totalResults
      }
    )