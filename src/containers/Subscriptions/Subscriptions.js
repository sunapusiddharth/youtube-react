import React, { Component } from 'react'
import {Subscription} from './Subscription/Subscription'
import './Subscriptions.scss'
import {Divider} from "semantic-ui-react"
import {SideBarHeader} from '../SideBarHeader/SideBarHeader'

export default class Subscriptions extends Component {
  render() {
    return (
        <React.Fragment>
            <SideBarHeader title="Subscriptions"/>
            <Subscription label="MusicChannel" broadcasting/>
            <Subscription label="TEDx Talks" amountNewVideo={10}/>
            <Subscription label="Stanford iOS" amountNewVideo={10}/>
            <Subscription label="Udacity" amountNewVideo={10}/>
            <Divider/>
        </React.Fragment>
    )
  }
}
