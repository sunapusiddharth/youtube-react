import React from 'react'
import './VideoGrid.scss'
import {VideoGridHeader} from './VideoGridHeader/VideoGridHeader'
import {Divider} from 'semantic-ui-react'
import {VideoPreview} from '../VideoPreview/VideoPreview'

/*
First of all we check whether we get videos passed as props. If not, then we just render an empty div because there is nothing to display.

However, if we do have some videos, we just create a VideoPreview element for each of them. As soon as we map over an array and create components dynamically, we should pass a key prop so that React can render our components more efficiently. If you don’t do that, you get a warning.


*/

export function VideoGrid(props){
    if(!props.videos || !props.videos.length){
        return <div/>
    }
    const gridItems  = props.videos.map(video=>{
        return (
            <VideoPreview video={video} key={video.id} pathname='watch' search={`?v=${video.id}`}/>
        )
    })
    const divider = props.hideDivider ? null : <Divider/>

    return(
        <React.Fragment>
            <div className="video-section">
                <VideoGridHeader title="Trending"/>
                <div className="video-grid">
                   {gridItems}
                </div>
            </div>
            {divider}
        </React.Fragment>
    )
}