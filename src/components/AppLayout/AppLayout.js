// this file is used to show whther the home page pr the 
// main video page 

import React,{Component} from 'react'
import HeaderNav from '../../containers/HeaderNav/HeaderNav';
import './AppLayout.scss'

export default function AppLayout (props){
        return(
            <div className="app-layout">
                <HeaderNav/>
                hi above children component
                {props.children}
            </div>
        )
}