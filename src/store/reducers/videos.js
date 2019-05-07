import {MOST_POPULAR} from '../actions/video'
import {SUCCESS} from '../actions'
import {createSelector} from 'reselect'

const initialState = {
    byId:{},
    mostPopular:{},
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

export default function videosReducer(state=initialState,action){
    switch(action.type){
        case MOST_POPULAR[SUCCESS]:
            return reduceFetchMostPopularVideos(action.response,state)
            default:
                return state
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