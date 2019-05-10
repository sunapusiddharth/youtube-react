//this component will be used for presentational purpose and 
//will be reused for displaying the data in the component 
import React, { Component } from 'react'
import SideBar from '../../containers/SideBar/SideBar'
import {InfiniteScroll} from '../InfiniteScroll/InfiniteScroll'
import { VideoPreview } from '../VideoPreview/VideoPreview';

export  class VideoList extends Component {
  render() {
      const videoPreviews = this.getVideoPreviews()
    return (
      <React.Fragment>
          <SideBar/>
        <div className="video-list">
            <InfiniteScroll bottomReachedCallback={this.props.bottomReachedCallback} showLoader={this.showloader}>
                {videoPreviews}
            </InfiniteScroll>
        </div>
          
      </React.Fragment>
    )
  }

  /*
    You might be wondering what the hell we are doing at the beginning of this function. We’re just making sure that the videos we get passed already have a description. So suppose you come from the Home feed and you click Trending on the left side bar. We already loaded some of the most popular videos – but without description.
    So our Trending component would display our video previews without description first. Once our network request finishes, our Trending component re-renders and shows the video previews with description.
    This looks super strange for the user because he/she only sees the video thumbnail and its title and suddenly a description pops up. We don’t want to have this behaviour. The VideoList component should only show the video previews once the video descriptions are there. Since we load multiple videos in one blow, it is sufficient to check if the first video has a description. If yes, we can be reasonable certain that the other videos have a description as well.
    In this case we map over the videos and generate VideoPreview elements from them. Once clicked, the user should be redirected to the Watch component. That’s why we pass the pathname and search prop.
  */
  getVideoPreviews(){
      if(!this.props.video || !this.props.video.length){
          return null
      }
      const firstVideo = this.props.videos[0]
      if(!firstVideo.snippet.description) {return null}
      return this.props.videos.map(video=>(
          <VideoPreview horizontal={true} expanded={true} video={video} pathname={'/watch'} search={'?v='+video.id}/>
      ))
  }
}
