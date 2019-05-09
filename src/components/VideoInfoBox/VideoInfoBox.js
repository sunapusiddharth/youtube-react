import React, { Component } from 'react'
import './VideoInfoBox.scss'
import {Image,Button} from 'semantic-ui-react'
import { createSecurePair } from 'tls';
import Linkify from 'react-linkify'
import {getPublishedAtDateString} from '../../services/date/date-format'
import { getShortNumberString } from '../../services/number/number-format';

export  class VideoInfoBox extends Component {

    //thsi is used to create links in the description 
    //linkify will create links
    // If no description is available, we just don’t do anything and return null.
    getDescriptionParagraphs(){
        const videoDescription = this.props.video.snippet ? this.props.video.snippet.description:null
        if(!videoDescription){
            return null
        }
        return videoDescription.split('\n').map((paragraph,index)=><p key={index} ><Linkify>{paragraph}</Linkify></p>)
    }

    getConfig(){
        let descriptionTextClass='collapsed'
        let buttonTitle = 'Show More'
        if(!this.state.collapsed){
            descriptionTextClass='expanded'
            buttonTitle='Show Less'
        }
        return{
            descriptionTextClass,
            buttonTitle
        }
    }

    constructor(props){
        super(props)
        this.state={
            collapsed:true
        }
    }

    onToggleCollapseButtonClick = ()=>{
        this.setState((prevState)=>{
            return{
                collapsed:!prevState.collapsed
            }
        })
    }

  render() {
      if(!this.props.video){
          return <div/>
      }
      const descriptionParagraphs = this.getDescriptionParagraphs()
      const {descriptionTextClass,buttonTitle} = this.getConfig()
      const publishedAtString = getPublishedAtDateString(this.props.video.snippet.publishedAt)
      const {channel} = this.props
      const buttonText = this.getSubscriberButtonText()
      const channeThumbnail = channel.snippet.thumbnails.medium.url
      const channelTtitle = channel.snippet.title

    return (
      <div className='video-info-box'>
          <Image className='channel-image' src={channeThumbnail} circular/>
          <div className="video-info">
            <div className="channel-name">{channelTtitle}</div>
            <div className="video-publication-date">{publishedAtString}</div>
          </div>
          <Button color='youtube'>{buttonText}</Button>
            <div className="video-description">
                <div className={descriptionTextClass}>
                    {descriptionParagraphs}
                </div>
                <Button compact onClick={this.onToggleCollapseButtonClick}>{buttonTitle} </Button>
            </div>
      </div>
    )
  }

  getSubscriberButtonText(){
      const {channel} = this.props
      const parsedSubscriberCount = Number(channel.statistics.sunscriberCount)
      const subscriberCount = getShortNumberString(parsedSubscriberCount)
      return `Subscribe ${subscriberCount}`
  }
}
