//functoinal component for the main navigation for routes.
import {Switch,Route} from 'react-router-dom';
import React from 'react';
import Sidhu from './containers/Watch/Sidhu';
import  Watch  from './containers/Watch/Watch';
import Home from './containers/Home/Home'

const Main = (props)=>{
    console.log('coming from main.js',props)
    return(
        <main>
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route exact path="/watch" render={()=><Watch key={props.location.key}/>}/>
                <Route exact path="/sidhu" component={Sidhu}/>
            </Switch>
        </main>
    )
}

export default Main;