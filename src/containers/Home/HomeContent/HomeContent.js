import React, { Component } from 'react'
import {VideoGrid} from '../../../components/VideoGrid/VideoGrid'
import './HomeContent.scss'
import SideBar from '../../SideBar/SideBar'
import {VideoPreview} from '../../../components/VideoPreview/VideoPreview'
import {connect} from 'react-redux'
import {getMostPopularVideos} from '../../../store/reducers/videos'

const AMOUNT_TRENDING_VIDEOS =12

class HomeContent extends Component {

    render(){
        const trendingVideos = this.getTrendingVideos()
        return(
            <React.Fragment>
                <SideBar/>
                <div className="home-content">
                    <div className="responsive-video-grid-container">
                        <VideoGrid title="Trending" videos={trendingVideos}/>
                    </div>
                    <VideoPreview/>
                </div>    
            </React.Fragment>
            
        )
    }

    getTrendingVideos(){
        return this.props.mostPopularVideos.slice(0,AMOUNT_TRENDING_VIDEOS)
    }
}
function mapStateToProps(state){
    return{
        mostPopularVideos:getMostPopularVideos(state)
    }
}


/*
We create a mapStateToProps function to pull in 
the selector we defined earlier. By doing so, we 
have access to an array of most popular videos via 
this.props.mostPopularVideos. 
There is also a new function called getTrendingVideos that returns 
us the first 12 videos we have stored
. At first, we only want to display a 
limited amount of trending videos and not all of them at once.
*/
export default connect(mapStateToProps,null)(HomeContent)