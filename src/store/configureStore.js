import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import filtersReducer from '../reducers/filters';
import videosReducer from '../reducers/videos';
import authReducer from '../reducers/auth';
import paginationReducer from '../reducers/pagination';

import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default () => {
    const store = createStore(
        combineReducers({
            filters: filtersReducer,
            videos: videosReducer,
            auth: authReducer,
            page: paginationReducer
        }),
        composeEnhancers(applyMiddleware(thunk))
    )
    return store;
};