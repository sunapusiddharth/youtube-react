//functoinal component for the main navigation for routes.
import {Switch,Route,withRouter} from 'react-router-dom';
import React from 'react';
import Sidhu from './containers/Watch/Sidhu';
import  Watch  from './containers/Watch/Watch';
import Home from './containers/Home/Home'
import Trending from './containers/Trending/Trending';
import Search from './containers/Search/Search'

const Main = (props)=>{
    console.log('coming from main.js',props.location.key)
    return(
        <main>
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route exact path="/watch" render={()=><Watch key={props.location.key}/>}/>
                <Route exact path="/sidhu" component={Sidhu}/>
                <Route exact path="/feed/trending" component={Trending}/>
                <Route exact path="/results" render={()=><Search key={props.location.key}/>}/>
            </Switch>
        </main>
    )
}

export default withRouter(Main);