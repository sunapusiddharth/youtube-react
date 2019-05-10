import React, { Component } from 'react'
import './Search.scss'
import {getYoutubeLibraryLoaded} from '../../store/reducers/api'
import {getSearchNextPageToken,getSearchResults} from '../../store/reducers/search'
import * as searchActions from '../../store/actions/search'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { getSearchParam } from '../../services/url';
import {withRouter} from 'react-router-dom'

class Search extends Component {
  constructor(props){
    super(props) 
  }

  componentDidMount(){
    if(!this.getSearchQuery()){
      //redirect tot home if search query is not there 
      this.props.history.push('/')
    }
    this.searchForVideos()
  }
  
  componentDidUpdate(prevProps){
    if(prevProps.youtubeApiLoaded !== this.props.youtubeApiLoaded){
      this.searchForVideos()
    }
  }

  getSearchQuery(){
    return getSearchParam(this.props.location,'search_query')
  }

  searchForVideos(){
    const searchQuery = this.getSearchQuery()
    if(this.props.youtubeApiLoaded){
      this.props.searchForVideos(searchQuery)
    }
  }

  render() {
    console.log(this.props)
    console.log('coming from search js')
    return (
      <div>
        hi from search component
      </div>
    )
  }
}

function mapStateToProps(state,props){
  return{
    youtubeApiLoaded:getYoutubeLibraryLoaded(state),
    searchResults:getSearchResults(state,props.location.search),
    nextPageToken:getSearchNextPageToken(state,props.location.search)
  }
}

function mapDispatchToProps(dispatch){
  const searchForVideos = searchActions.forVideos.request
  return bindActionCreators({searchForVideos},dispatch)
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Search))