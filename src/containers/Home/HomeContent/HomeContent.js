import React, { Component } from 'react'
import {VideoGrid} from '../../../components/VideoGrid/VideoGrid'
import './HomeContent.scss'

import {connect} from 'react-redux'
import {getMostPopularVideos,getVideosByCategory} from '../../../store/reducers/videos'
import {InfiniteScroll} from '../../../components/InfiniteScroll/InfiniteScroll'

const AMOUNT_TRENDING_VIDEOS =12

class HomeContent extends Component {
    //function to create grid dynamically :
    /*
    We added a new function called getVideoGridForCategories. In here we loop over the 
    category ids from this.props.videosByCategory and create a VideoGrid component for each category. We also do a little bit of styling by preventing the last video grid from showing a grey divider at its bottom
    */
    getVideoGridsForCategories(){
        const categoryTitles = Object.keys(this.props.videosByCategory || {})
        return categoryTitles.map((categoryTitle,index)=>{
            const videos= this.props.videosByCategory[categoryTitle]
            //the last video grid element should not have a divider 
            const hideDivider = index === categoryTitles.length-1
            return <VideoGrid title={categoryTitle} videos={videos} key={categoryTitle} hideDivider={hideDivider}/>
        })
    }

    render(){
        const trendingVideos = this.getTrendingVideos()
        const categoryGrids = this.getVideoGridsForCategories()
        return(
            <React.Fragment>
                
                <div className="home-content">
                    <div className="responsive-video-grid-container">
                        <VideoGrid title="Trending" videos={trendingVideos}/>
                        {categoryGrids}
                        <InfiniteScroll bottomReachedCallback={this.props.bottomReachedCallback} showLoader={this.props.showLoader}/>
                    </div>
                    
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
        videosByCategory:getVideosByCategory(state),
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