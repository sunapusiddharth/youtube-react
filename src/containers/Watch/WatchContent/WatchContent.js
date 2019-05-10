import React, { Component } from 'react'
import Video from '../../../components/Video/Video';
import {VideoMetadata} from '../../../components/VideoMetadata/VideoMetadata';
import {VideoInfoBox} from '../../../components/VideoInfoBox/VideoInfoBox';
import {Comments} from '../../Comments/Comments';
import {RelatedVideos} from '../../../components/RelatedVideos/RelatedVideos';
import {getRelatedVideos, getVideoById, getAmountComments} from '../../../store/reducers/videos';
import './WatchContent.scss';
import {connect} from 'react-redux'
import { getChannel } from '../../../store/reducers/channels';
import { getCommentsForVideo,getCommentNextPageToken } from '../../../store/reducers/comment';
import {InfiniteScroll} from '../../../components/InfiniteScroll/InfiniteScroll'

 class WatchContent extends Component {
  render() {
    if(!this.props.videoId){
      return "<div/>"
    }
    return (
      <InfiniteScroll bottomReachedCallback={this.props.bottomReachedCallback} showLoader={this.showLoader}>
      <div className='watch-grid'>
               <Video className='video' id={this.props.videoId}/>
               <VideoMetadata className="metadata" viewCount={1000} video={this.props.video}/>
               <VideoInfoBox className='video-info-box' video={this.props.video} channel={this.props.channel}/>
                <Comments className='comments' comments = {this.props.comments} amountComments={112499} amountComments={this.props.amountComments}/>
               <RelatedVideos className='relatedVideos' videos={this.props.relatedVideos}/>
        </div>
      </InfiniteScroll>
    )
  }
  //The shouldShowLoader function returns true if we have a next page token. 
  //If not, it returns false
  showLoader(){
    return !!this.props.nextPageToken
  }
}
function mapStateToProps(state,props){
    //this props will hold all the video data 
    return{
      relatedVideos: getRelatedVideos(state, props.videoId),
        video:getVideoById(state,props.videoId),
        channel:getChannel(state,props.channelId),
        comments:getCommentsForVideo(state,props.videoId),
        amountComments:getAmountComments(state,props.videoId),
        commentNextPageToken:getCommentNextPageToken(state,props)
    }
}

export default connect(mapStateToProps,null)(WatchContent)