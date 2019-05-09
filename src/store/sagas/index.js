
import {all,call,put,fork} from 'redux-saga/effects';
import {watchMostPopularVideos,watchVideoCategories,watchMostPopularVideosByCategory,} from  './video'
import {watchWatchDetails} from './watch'
export default function* (){
  yield all([
    fork(watchMostPopularVideos),
    fork(watchVideoCategories),
    fork(watchMostPopularVideosByCategory),
    fork(watchWatchDetails),
  ]);
}

/*
* entity must have a success, request and failure method
* request is a function that returns a promise when called
* */

export function* fetchEntity(request, entity, ...args) {
  try {
    const response = yield call(request);
    // we directly return the result object and throw away the headers and the status text here
    // if status and headers are needed, then instead of returning response.result, we have to return just response.
    yield put(entity.success(response.result, ...args));
  } catch (error) {
    yield put(entity.failure(error, ...args));
  }
}


/*
The ignoreErrors function takes a function as an input (fn). 
It also takes an arbitrary amount of arguments to that function as an input. 
This is what we indicate with ...args. It means that if we call ignoreErrors with n parameters, 
the last n-1 parameters are passed as parameters to the first parameter ,which is the function fn. 
I know it’s kinda weird. Now if the promise resolves,
 we just return the result, if the promise is rejected, we just return the error and pretend nothing has happened
*/
export function ignoreErrors(fn, ...args) {
  return () => {
    const ignoreErrorCallback = (response) => response;
    return fn(...args).then(ignoreErrorCallback, ignoreErrorCallback);
  };
}