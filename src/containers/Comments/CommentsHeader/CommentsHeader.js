import React, { Component } from 'react'
import {Button,Icon} from 'semantic-ui-react'
import './CommentsHeader.scss'

const  CommentsHeader = (props) =>{
    return (
      <div className='comments-header'>
          <h4>{props.amountComments} Comments</h4>
          <Button basic compact icon labelPosition='left'>
             <Icon name='align left'/>
             Sort By
          </Button>
        
      </div>
    )
}

export default CommentsHeader