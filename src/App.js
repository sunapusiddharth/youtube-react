import React, { Component } from 'react';
import Home from './containers/Home/Home'
import AppLayout from './components/AppLayout/AppLayout'
import {Route,Switch,withRouter} from 'react-router-dom'
import Main from './Main'
import {connect} from 'react-redux'
import {youtubeLibraryLoaded} from './store/actions/api'
import {bindActionCreators} from 'redux'
import Sidhu from './containers/Watch/Sidhu'
import  Watch  from './containers/Watch/Watch'
import Trending from './containers/Trending/Trending';
import Search from './containers/Search/Search'

const API_KEY = 'AIzaSyBAfi5VuqfCm5oTh-Kx5axOLwx6ds3PCfw'

/*
Basically, Redux is taking control of our component and does not re render it when the URL changes. 
A component is re rendered when at least one of its properties changes. So if we make the URL / location a property of our App component then our component should be re rendered as soon as the URL is updated.

The only thing we need to do is to wrap our App component inside the withRouter higher order component. 
The withRouter helper basically inserts the current URL as a prop inside our component. It is accessible via this.props.location. 
So if our URL changes, our App component re renders and we get redirected.
*/

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
      <Switch>
                <Route exact path='/' component={Home}/>
                <Route exact path="/watch" render={()=><Watch key={this.props.location.key}/>}/>
                <Route exact path="/sidhu" component={Sidhu}/>
                <Route exact path="/feed/trending" component={Trending}/>
                <Route exact path="/results" render={()=><Search key={this.props.location.key}/>}/>
      </Switch>
      </AppLayout>
      </div>
    );
  }
}

function mapDispatchToProps  (dispatch){
  return bindActionCreators({youtubeLibraryLoaded},dispatch)
}

export default withRouter(connect(null,mapDispatchToProps)(App))
