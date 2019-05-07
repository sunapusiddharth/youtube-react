//This file will do the redux store setup and plug in our redux-saga middleware. We put this into a separate file because we want a clean separation of concerns.
import {applyMiddleware,createStore,compose} from 'redux'
import reducer from './reducers'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'


// We first call a function from redux-saga createSagaMiddleware. After that we plug our middleware into our store by passing it as an argument to applyMiddleware(sagaMiddleware).
export function configureStore(){
    const sagaMiddleware = createSagaMiddleware()
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    const store = createStore(
        reducer,
        composeEnhancers(
            applyMiddleware(sagaMiddleware)
        ));
    sagaMiddleware.run(rootSaga) //we only need our saga middleware to run our root saga (line 13) which is supposed to bundle all of the small sagas we will create in the future.
    return store
}
