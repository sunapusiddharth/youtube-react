import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'


//this component's purpose is to always scrollt he user to the top of the page whenever the location changes
// the scoll position will be changed 
export  class ScrollToTop extends Component {
    componentDidUpdate(prevProps){
        if(this.props.location !== prevProps.location && window){
            window.scrollTo(0,0) //this always scrolls to the top of the page 
        }
    }
  render() {
    return this.props.children
  }
}

export default withRouter(ScrollToTop)