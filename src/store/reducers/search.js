import {SEARCH_FOR_VIDEOS} from '../actions/search'
import {SUCCESS, REQUEST} from '../actions'

export default function(state={},action){
    switch(action.type){
        case SEARCH_FOR_VIDEOS[REQUEST]:
        console.log('coming from reducer search-',action)
        return reduceSearchVideos(action.response,action.searchQuery)
        default:
        return state
    }
}

//reducer for getting search videos 
//since we need key for each lost item in the VideoPreview component
//that's why we use map functio to add id for every item
//we map over all results and copy all the properties but replace nthe value of id property with actual
//videoId
function reduceSearchVideos(response,searchQuery,prevState){
    let searchResults = response.items.map(item=>({...item,id:item.id.videoId}))
    if(prevState.query === searchQuery){
        const prevResults = prevState.results||[]
        searchResults = prevResults.concat(searchResults)
    }

    return{
        totalResults:response.pageInfo.totalResults,
        nextPageToken:response.nextPageToken,
        query:searchQuery,
        results:searchResults
    }
}

//creating selectors to avoid tight coupling 
//we need a selector to return the search results 
//and another one to return the next page token - we need this token for infinite scrolling 
export const getSearchResults = (state) =>state.search.results;
export const getSearchNextPageToken = (state)=>state.search.nextPageToken
