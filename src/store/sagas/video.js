import {call,fork,take,takeEvery,all,put} from 'redux-saga/effects'
import * as api from '../api/youtube-api'
import * as videoActions from '../actions/video'
import {REQUEST} from '../actions'
import {fetchEntity, ignoreErrors} from './index'

export function* watchMostPopularVideos() {
    while (true) {
      const {amount, loadDescription, nextPageToken} = yield take(videoActions.MOST_POPULAR[REQUEST]);
      yield fork(fetchMostPopularVideos, amount, loadDescription, nextPageToken);
    }
  }
  
  export function* fetchMostPopularVideos(amount, loadDescription, nextPageToken) {
    const request = api.buildMostPopularVideosRequest.bind(null, amount, loadDescription, nextPageToken);
    yield fetchEntity(request, videoActions.mostPopular);
  }

export const fetchVideoCategories = fetchEntity.bind(null, api.buildVideoCategoriesRequest, videoActions.categories);

export function* watchVideoCategories() {
  yield takeEvery(videoActions.VIDEO_CATEGORIES[REQUEST], fetchVideoCategories);
}

//this is a watcher saga we listen for MOST_POPULAR_BY_CATEGORY_REQUEST action
//and extract the category ids from the payload and let our worker saga do the rest
export function* watchMostPopularVideosByCategory() {
  while(true) {
    const {categories} = yield take(videoActions.MOST_POPULAR_BY_CATEGORY[REQUEST]);
    yield fork(fetchMostPopularVideosByCategory, categories);
  }
}



//in this worker saga we pass a param called ccatefories which has multiple category ids 
//for each category we build a request using buildMostPopularVideosRequest ans then wrapp it inside a redux-saga call effect by using call()
//then we execute all the requests using all which willproces all the req parallely like promise.all
//
export function* fetchMostPopularVideosByCategory(categories) {
  const requests = categories.map(category => {
    const wrapper = ignoreErrors(api.buildMostPopularVideosRequest, 12, false, null, category);
    return call(wrapper);
  });
  try {
    const response = yield all(requests);
    yield put(videoActions.mostPopularByCategory.success(response, categories));
  } catch (error) {
    yield put(videoActions.mostPopularByCategory.failure(error));
  }
}
