import React,{Component} from 'react'
import WatchContent from './WatchContent/WatchContent'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { getYoutubeLibraryLoaded } from '../../store/reducers/api';
import {withRouter} from 'react-router-dom'
import * as watchActions from '../../store/actions/video'
import { getChannelId } from '../../store/reducers/videos';
import {getSearchParam} from '../../services/url';
 
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
        return(
           <WatchContent videoId={videoId} channelId={this.props.channelId}/>
        )
    }
}
function mapStateToProps(state,props){
    //here we call the function getYoutubeLibraryLoaded from Redux state
    return{
        youtubeLibraryLoaded:getYoutubeLibraryLoaded(state),
        channelId:getChannelId(state,props.location,'v')
    }
}

function mapDispatchToProps(dispatch){
    const fetchWatchDetails = watchActions.details.request
    return bindActionCreators({fetchWatchDetails},dispatch)
}
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Watch))