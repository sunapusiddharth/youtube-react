import React from 'react'
import { Checkbox, Divider } from 'semantic-ui-react';
import { VideoPreview } from '../../VideoPreview/VideoPreview';

export function NextUpVideo(props){

    return(
        <React.Fragment>
            <div className="next-up-container">
                <h4>Up Next</h4>
                <div className="up-next-toggle">
                    <Checkbox toggle defaultChecked/>
                </div>
            </div>
            <VideoPreview horizontal={true} video={props.video} pathname='/watch' search={`?v=${props.video.id}`}/>
            <Divider/>
        </React.Fragment>
    )
}