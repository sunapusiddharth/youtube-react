import React, { Component } from 'react'
import Video from '../../../components/Video/Video';
import {VideoMetadata} from '../../../components/VideoMetadata/VideoMetadata';
import {VideoInfoBox} from '../../../components/VideoInfoBox/VideoInfoBox';
import {Comments} from '../../Comments/Comments';
import {RelatedVideos} from '../../../components/RelatedVideos/RelatedVideos';
import {getRelatedVideos, getVideoById} from '../../../store/reducers/videos';
import './WatchContent.scss';
import {connect} from 'react-redux'
import { getChannel } from '../../../store/reducers/channels';

 class WatchContent extends Component {
  render() {
    if(!this.props.videoId){
      return "<div/>"
    }
    return (
      <div className='watch-grid'>
               <Video className='video' id={this.props.videoId}/>
               <VideoMetadata className="metadata" viewCount={1000} video={this.props.video}/>
               <VideoInfoBox className='video-info-box' video={this.props.video} channel={this.props.channel}/>
                <Comments className='comments'/>
               <RelatedVideos className='relatedVideos' videos={this.props.relatedVideos}/>
        </div>
    )
  }
}
function mapStateToProps(state,props){
    //this props will hold all the video data 
    return{
      relatedVideos: getRelatedVideos(state, props.videoId),
        video:getVideoById(state,props.videoId),
        channel:getChannel(state,props.channelId)
    }
}

export default connect(mapStateToProps,null)(WatchContent)