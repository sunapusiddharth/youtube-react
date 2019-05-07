import React, { Component } from 'react';
import HeaderNav from './containers/HeaderNav/HeaderNav'
import SideBar from './containers/SideBar/SideBar'

import Home from './containers/Home/Home'
import AppLayout from './components/AppLayout/AppLayout'
import {Route,Switch} from 'react-router-dom'
import Main from './Main'
import {connect} from 'react-redux'
import {youtubeLibraryLoaded} from './store/actions/api'
import {bindActionCreators} from 'redux'

const API_KEY = 'AIzaSyBAfi5VuqfCm5oTh-Kx5axOLwx6ds3PCfw'

class App extends Component {

  componentDidMount(){
    this.loadYoutubeApi()
  }

  loadYoutubeApi(){
    const script = document.createElement('script')
    script.src = 'https://apis.google.com/js/client.js'
    script.onload = ()=>{
      window.gapi.load('client',()=>{
        window.gapi.client.setApiKey(API_KEY)
        window.gapi.client.load('youtube','v3',()=>{
          this.props.youtubeLibraryLoaded()
        })
      })
    }
    document.body.appendChild(script)
  }

  render() {
    return (
      <div className="main-container">
      <AppLayout>
      <Main/>
      </AppLayout>
      </div>
    );
  }
}

function mapDispatchToProps  (dispatch){
  return bindActionCreators({youtubeLibraryLoaded},dispatch)
}

export default connect(null,mapDispatchToProps)(App)
