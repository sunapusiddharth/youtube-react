import { WATCH_DETAILS } from "../actions/watch";
import { SUCCESS } from "../actions";
import {COMMENT_THREAD_LIST_RESPONSE} from '../api/youtube-response-types';
import {createSelector} from 'reselect'
import {getSearchParam} from '../../services/url'


const initialState={
    byVideo:{},
    byId:{}
}

export default function (state=initialState,action){
    switch(action.type){
        case WATCH_DETAILS[SUCCESS]:
        return reduceWatchDetails(action.response,action.videoId,state)
        default:
        return state
    }
}

function reduceWatchDetails(responses,videoId,prevState){
    const commentThreadResponse = responses.find(response=>response.result.kind === COMMENT_THREAD_LIST_RESPONSE)
    return reduceCommentThread(commentThreadResponse.result,videoId,prevState)
}


function reduceCommentThread(response,videoId,prevState){
    if(!response){
        return prevState
    }

    const newComments  = response.items.reduce((acc,item)=>{
        acc[item.id] = item
        return acc
    },{})

    // if we have already fetched some comments for a particular video
    // we just append the ids for the new comments
    const prevCommnetIds = prevState.byVideo[videoId] ? prevState.byVideo[videoId].ids:[]
    const commentIds = [...prevCommnetIds,...Object.keys(newComments)]
    const byVideoComment = {
        nextPageToken:response.nextPageToken,
        ids:commentIds
    }

    return {
        ...prevState,
        [videoId]:byVideoComment
    }
}

const getCommentIdsForVideo = (state,videoId)=>{
    const comment = state.comments.byVideo[videoId]
    if(comment){
        return comment.ids
    }
    return []
}

export const getCommentsForVideo = createSelector(
    getCommentIdsForVideo,
    state=>state.comments.byId,
    (commentIds,allComments)=>{
        return commentIds.map(commentId => allComments[commentId])
    }
)

const getComment = (state, location) => {
    const videoId = getSearchParam(location, 'v');
    return state.comments.byVideo[videoId];
  };
  export const getCommentNextPageToken = createSelector(
    getComment,
    (comment) => {
      return comment ? comment.nextPageToken : null;
    }
  );