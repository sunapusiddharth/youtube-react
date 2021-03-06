import React from 'react';
import {Image} from 'semantic-ui-react';
import './VideoPreview.scss';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import {getShortNumberString} from '../../services/number/number-format'
import {getVideoDurationString} from '../../services/date/date-format'
import {Link} from 'react-router-dom'

TimeAgo.locale(en)
const timeAgo = new TimeAgo('en-US')

export class VideoPreview extends React.Component {
  render() {
    const {video} = this.props
    if(!video){
      return <div/>
    }
    const viewAndTimeString = VideoPreview.getFormattedViewAndTimeString(video)
    const horizontal = this.props.horizontal ? 'horizontal':null
    const duration = video.contentDetails ?video.contentDetails.duration:null
    const videoDuration  =getVideoDurationString(duration)
    const expanded = this.props.expamded ?'expanded':null
    const description = this.props.expanded ? video.snippet.description:null

    // Our VideoPreview component now expects two new props: pathname and search. 
    // The pathname prop is the absolute path to which the user should be redirected to.
    //  For example, if we want to get redirected to /foo/bar, then pathname must be set to ‘/foo/bar'.
    // The search prop is the query string that we want to append to the address, so if we want 
    // to add ?id=1234 as query parameters to our URL, we need to set the search prop to '?id=1234'
    
    return (
    <Link to ={{pathname:this.props.pathname,search:this.props.search}}>
    <div className={['video-preview',horizontal,expanded].join(' ')}>
        <div className='image-container'>
          <Image src={video.snippet.thumbnails.medium.url}/>
          <div className='time-label'>
            <span>{videoDuration}</span>  
          </div>
        </div>

        <div className='video-info'>
          <div className={['semi-bold', 'show-max-two-lines',expanded].join(' ')}>{video.snippet.title}</div>
          <div className='video-preview-metadata-container'>
            <div className='channel-title'>{video.snippet.channelTitle}</div>
            <div className='view-and-time'>{viewAndTimeString}</div>
            <div className='show-max-two-lines'>{description}</div>
          </div>
        </div>
      </div>
    </Link>
    );
  }
  static getFormattedViewAndTimeString(video){
    const publicationDate = new Date(video.snippet.publishedAt)
    const viewCount = video.statistics ? video.statistics.viewCount:null
    if(viewCount){
      const viewCountShort = getShortNumberString(video.statistics.viewCount)
      return `${viewCountShort} views . ${timeAgo.format(publicationDate)}`
    }
    return ''
  }
}