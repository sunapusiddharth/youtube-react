import {MOST_POPULAR, VIDEO_CATEGORIES,MOST_POPULAR_BY_CATEGORY} from '../actions/video'
import {SUCCESS} from '../actions'
import {createSelector} from 'reselect'

const initialState = {
    byId:{},
    mostPopular:{},
    categories:{},
    byCategory:{}
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
