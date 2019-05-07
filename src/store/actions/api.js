import {createAction} from './index'
export const YOUTUBE_LIBRARY_LOADED =  'YOUTUBE_LIBRARY_LOADED'
export const youtubeLibraryLoaded = createAction.bind(null,YOUTUBE_LIBRARY_LOADED)
// we are using Javascript's binding functionality which will return a new function and pre-assign the parameters