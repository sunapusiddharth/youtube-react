import React, { Component } from 'react'
import  './Trending.scss'
import {VideoPreview} from '../../components/VideoPreview/VideoPreview'
import SideBar from '../SideBar/SideBar'
import { getMostPopularVideos,allMostPopularVideosLoaded,getMostPopularVideosNextPageToken } from '../../store/reducers/videos';
import { getYoutubeLibraryLoaded } from '../../store/reducers/api';
import { bindActionCreators } from '../../../../../../Library/Caches/typescript/3.3/node_modules/redux';
import {InfiniteScroll} from '../../components/InfiniteScroll/InfiniteScroll'
import {connect} from 'react-redux'
import * as videoActions from '../../store/actions/video'
import {VideoList} from '../../components/VideoList/VideoList'

class Trending extends Component {
    componentDidMount(){
        console.log('inside Trending componentDidMount')
        this.fetchTrendingVideos()
    }

    componentDidUpdate(prevProps){
        if(prevProps.youtubeLibraryLoaded !== this.props.youtubeLibraryLoaded){
            console.log('inside Trending componentDidUpdate')
            this.fetchTrendingVideos()
        }
    }

    fetchTrendingVideos(){
        if(this.props.youtubeLibraryLoaded){
            console.log('inside Trending fetchTrendingVideos')
            this.props.fetchMostPopularVideos(20,true)
        }
    }
  render() {
      const loaderActive = this.shouldShowLoader()
    return (
      <VideoList bottomReachedCallback={this.fetchMoreVideos}
      showLoader={loaderActive}
      videos={this.props.videos}/>
    )
  }

  showLoader(){
      return !this.props.allMostPopularVideosLoaded
  }
  /*
  The fetchMoreVideos function dispatches the MOST_POPULAR_REQUEST action and passes along our next page token. 
  Like so, we make sure that we only fetch new videos. When we reach the bottom, 
  we fetch twelve new videos and insist that the endpoint returns us the video's description
  */
  fetchMoreVideos = ()=>{
      const {nextPageToken} = this.props
      if(this.props.youtubeLibraryLoaded && nextPageToken){
          this.props.fetchMostPopularVideos(12,true,nextPageToken)
      }
  }
}

//here we are puling two main things from videos and youtubeLibrary loaded from the
//redux selectors - we wire up the component with selectors in this fn
//we have mapped the props to the selector allMostPopularVideosLoaded and getMostPopularVideosNextPageToken
function mapStateToProps(state,props){
    return{
        videos:getMostPopularVideos(state),
        youtubeLibraryLoaded:getYoutubeLibraryLoaded(state),
        allMostPopularVideosLoaded:allMostPopularVideosLoaded(state),
        nextPageToken:getMostPopularVideosNextPageToken(state),
    }
}

//we import videos mostPopular action creator and bind  it to fetchMostPopularVideos
function mapDsipatchToProps(dispatch){
    const fetchMostPopularVideos = videoActions.mostPopular.request
    return bindActionCreators({fetchMostPopularVideos},dispatch)
}

export default connect(mapStateToProps,mapDsipatchToProps)(Trending)