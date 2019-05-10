import React,{Component} from 'react'
import WatchContent from './WatchContent/WatchContent'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { getYoutubeLibraryLoaded } from '../../store/reducers/api';
import {withRouter} from 'react-router-dom'
import * as watchActions from '../../store/actions/video'
import { getChannelId } from '../../store/reducers/videos';
import {getSearchParam} from '../../services/url';
import * as commentActions from '../../store/actions/comment'
import { getCommentNextPageToken } from '../../store/reducers/comment';
 
class Watch extends Component{

    //function to extract the video id from the url
    //here we use 
    // interface URLSearchParams {
    //     [Symbol.iterator](): IterableIterator<[string, string]>;
    //     /**
    //      * Returns an array of key, value pairs for every entry in the search params.
    //      */
    //     entries(): IterableIterator<[string, string]>;
    //     /**
    //      * Returns a list of keys in the search params.
    //      */
    //     keys(): IterableIterator<string>;
    //     /**
    //      * Returns a list of values in the search params.
    //      */
    //     values(): IterableIterator<string>;
    // }

    getVideoId(){
        return new URLSearchParams(this.props.location,'v')
    }

    componentDidMount(){
        if(this.props.youtubeLibraryLoaded){
            console.log("hi from watch componentDidMOunt")
            this.fetchWatchContent()
        }
    }
    
    componentDidUpdate(prevProps){
        if(this.props.youtubeLibraryLoaded !== prevProps.youtubeLibraryLoaded){
            console.log("hi from watch componentDidUpdate")
            this.fetchWatchContent()
        }
    }

    fetchWatchContent() {
        const videoId = this.getVideoId();
        if (!videoId) {
          this.props.history.push('/');
        }
        this.props.fetchWatchDetails(videoId, this.props.channelId);
      }

    render(){
        const videoId = this.getVideoId()
        //here we are passing the fetchMoreComments fn 
        // inside the WatchContent fn that willl load more comments 
        //this will be called when user scrolls to the bottom 
        return(
           <WatchContent videoId={videoId} 
           channelId={this.props.channelId}
            bottomReachCallback={this.fetchMoreComments}
           nextPageToken={this.props.nextPageToken}/>
        )
    }

    //The fetchMoreComments function makes dispatches the COMMENT_THREAD_REQUEST action when we call it. 
    // This is only done if we have a next page token available. 
    // Otherwise we would just fetch the first n comments of a video again.

    fetchMoreComments = ()=>{
        if(this.props.nextPageToken){
            this.props.fetchCommentThread(this.getVideoId,this.props.nextPageToken)
        }
    }
}

function mapStateToProps(state,props){
    //here we call the function getYoutubeLibraryLoaded from Redux state
    return{
        youtubeLibraryLoaded:getYoutubeLibraryLoaded(state),
        channelId:getChannelId(state,props.location,'v'),
        nextPageToken:getCommentNextPageToken(state,props.location)
    }
}

//fetchCommentThread - we use it to wire up the comment thread request action creator to our local state
function mapDispatchToProps(dispatch){
    const fetchWatchDetails = watchActions.details.request
    const fetchCommentThread = commentActions.thread.request
    return bindActionCreators({fetchWatchDetails,fetchCommentThread},dispatch)
}
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Watch))