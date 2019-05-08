import React ,{Component} from 'react'
import {connect} from 'react-redux'
import * as videoActions from '../../store/actions/video'
import {bindActionCreators} from 'redux'
import {getYoutubeLibraryLoaded} from '../../store/reducers/api'
import {getVideoCategoryIds,videoCategoriesLoaded,videosByCategoryLoaded} from '../../store/reducers/videos'
import SideBar from '../SideBar/SideBar'
import {VideoPreview} from '../../components/VideoPreview/VideoPreview'
import './Home.scss'
import HomeContent from './HomeContent/HomeContent';


 class Home extends Component{
     constructor(props){
        super(props)
        this.state={
            categoryIndex:0
        }
     }
    componentDidMount(){
        if(this.props.youtubeLibraryLoaded){
            this.fetchCategoriesAndMostPopularVideos()
        }
    }

    componentDidUpdate(prevProps){
        if(this.props.youtubeLibraryLoaded !== prevProps.youtubeLibraryLoaded){
            this.fetchCategoriesAndMostPopularVideos()
        }else{
            this.fetchVideosByCategory()
        }
    }

    fetchVideosByCategory(){
        const categoryStartIndex = this.state.categoryIndex
        const categories = this.props.videoCategories.slice(categoryStartIndex,categoryStartIndex+3)
        this.props.fetchMostPopularVideosByCategory(categories)
        this.setState(prevState=>{
            return{
                categoryIndex:prevState.categoryIndex+3
            }
        })
    }

    fetchCategoriesAndMostPopularVideos(){
        this.props.fetchMostPopularVideos()
        this.props.fetchVideoCategories()
    }
    render(){
        return(
            <React.Fragment>
            <SideBar/>
                <HomeContent
                    bottomReachedCallback = {this.bottomReachedCallback}
                    showLoader = {this.shouldShowLoader()}
                />
                <VideoPreview/>
            </React.Fragment>
            
        )
    }

    bottomReachedCallback = ()=>{
        console.log('inside the scrolling callback')
        console.log(this.props.videoCategoriesLoaded)
        if(!this.props.videoCategoriesLoaded){
            return
        }
        this.fetchVideosByCategory()
    }
    shouldShowLoader(){
        if(!this.props.videoCategoriesLoaded && this.props.videosByCategoryLoaded){
            return this.state.categoryIndex < this.props.videoCategories.length
        }
        return false
    }
}

function mapStateToProps(state){
    return{
        youtubeLibraryLoaded:getYoutubeLibraryLoaded(state),
        videoCategories:getVideoCategoryIds(state),
        videoCategoriesLoaded:videoCategoriesLoaded(state),
        videosByCategoryLoaded:videosByCategoryLoaded(state)
    }
}

function mapDispatchToProps(dispatch){
    const fetchMostPopularVideos = videoActions.mostPopular.request
    const fetchVideoCategories = videoActions.categories.request
    const fetchMostPopularVideosByCategory = videoActions.mostPopularByCategory.request
    return bindActionCreators({fetchMostPopularVideos,fetchVideoCategories,fetchMostPopularVideosByCategory},dispatch)
    
}

export default connect(mapStateToProps,mapDispatchToProps)(Home)