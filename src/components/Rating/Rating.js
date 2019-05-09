import React from 'react'
import {Progress,Icon} from 'semantic-ui-react'
import {getShortNumberString} from '../../services/number/number-format'

export function Rating(props){
    let likeCount = props.likeCount !==0?props.likeCount :null
    let dislikeCount = null
    let rating = null
    if(props.likeCount && props.dislikeCount){
        const amountLikes = parseFloat(props.likeCount)
        const amountDislikes = parseFloat(props.dislikeCount)
        const percentagePositiveRatings = 100.0 * (amountLikes/(amountDislikes+amountLikes))

        likeCount = getShortNumberString(amountLikes)
        dislikeCount = getShortNumberString(amountDislikes)
        rating = <Progress percent={percentagePositiveRatings} size='tiny'/>
    }

    return(
        <div className="rating">
            <div >
                <Icon name='thumbs outline up'/>
                <span>{likeCount}</span>
            </div>
            <div>
            <Icon name='thumbs outline down'/>
                <span>{dislikeCount}</span>
            </div>
            {rating}
        </div>
        
    )
}