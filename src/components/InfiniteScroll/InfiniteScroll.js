import React from 'react';
import {Waypoint} from 'react-waypoint';
import {Loader} from 'semantic-ui-react';
import './InfiniteScroll.scss';

export function InfiniteScroll(props) {
  console.log("hi from infinite scroller")
  console.log(props)
  return (
    <React.Fragment>
      {props.children}
      <h1>Sidhu hwere</h1>
      <Waypoint onEnter={props.bottomReachedCallback}>
        <div className='loader-container'>
          <Loader active={props.showLoader} inline='centered' />
        </div>
      </Waypoint>
    </React.Fragment>
  );
}