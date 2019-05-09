import React from 'react'
import './RelatedVideos.scss'
import { VideoPreview } from '../VideoPreview/VideoPreview';
import { NextUpVideo } from './NextUpVideo/NextUpVideo';


// First we check whether we the videos passed as props and if the videos array is also not empty.
// The first element in the videos array will be displayed in the NextUpVideo component. All other videos (i.e. all videos starting from props.videos[1]) are put into a horizontal VideoPreview component.
// We pass the VideoPreview component a pathname and a search prop so the user gets redirected when he/she clicks on it.

export function RelatedVideos(props) {
    if (!props.videos || !props.videos.length) {
      return <div className='related-videos'/>;
    }
  
    // safe because before we check if the array has at least one element
    const nextUpVideo = props.videos[0];
    const remainingVideos = props.videos.slice(1);
  
    const relatedVideosPreviews = remainingVideos.map(relatedVideo => (
        <VideoPreview video={relatedVideo}
                      key={relatedVideo.id}
                      pathname='/watch'
                      search={`?v=${relatedVideo.id}`}
                      horizontal={true}/>
    ));
  
    return (
      <div className='related-videos'>
        <NextUpVideo video={nextUpVideo}/>
        {relatedVideosPreviews}
      </div>
    );
  }