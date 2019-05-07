import React from 'react'
import {Progress,Icon} from 'semantic-ui-react'

export function Rating(props){
    let progress=null
    if(props.likeCount && props.dislikeCount){
        const percent = 100*(props.likeCount)/(props.dislikeCount+props.likeCount)
        progress = <Progress className="progress" percent={percent} size='tiny'/>
    }

    return(
        <div className="rating">
            <div className="thumbs-up">
                <span>{props.likeCount}</span>
            </div>
            <div className="thumbs-down">
                <Icon name='thumbs outlibe down'/>
                <span>{props.dislikeCount}</span>
            </div>
            {progress}
        </div>
        
    )
}