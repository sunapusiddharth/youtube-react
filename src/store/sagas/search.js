import * as searchActions from '../actions/search'
import {REQUEST} from '../actions'
import {fork,take} from 'redux-saga/effects'
import * as api from '../api/youtube-api'
import {fetchEntity} from './index'

//this is watcher saga
//We listen for the SEARC_FOR_VIDEOS_REQUEST action.
//  Once such an action is dispatched, we extract the search query, amount and nextPageToken property from it and fork a worker saga. 
// We pass all parameters to our worker saga.

export function* watchSearchForVideos(){
    while(true){
        console.log("coming from watchSerchForVideos - ")
        //in this line we take the data from the search request action
        const {searchQuery,amount,nextPageToken} = yield take(searchActions.SEARCH_FOR_VIDEOS[REQUEST])
        
        yield fork(searchForVideos,searchQuery,nextPageToken,amount)
    }
}

//this is worker saga 
//we first bind the params to the buidlApiRequest function
//then we perform the actual request by using the utility fn fetchEntity
export function* searchForVideos(searchQuery,nextPageToken,amount){
    const request = api.buildApiRequest.bind(null,searchQuery,nextPageToken,amount)
    yield fetchEntity(request,searchActions.forVideos,searchQuery)
}