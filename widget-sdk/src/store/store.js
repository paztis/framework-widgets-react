import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import ReducerCombiner from '../reducers/ReducerCombiner';

// add the middlewares
const middlewares = [];
let middleware = applyMiddleware(...middlewares);

// add the redux dev tools
if (process.env.NODE_ENV !== 'production' && window.devToolsExtension) {
    middleware = compose(middleware, window.devToolsExtension());
}

// reducers
const reducers = {};
const reducerCombiner = new ReducerCombiner(reducers);

// create the store
const store = createStore(reducerCombiner.combineReducers(), middleware);

// listen reducer updates
reducerCombiner.setUpdateHandler(() => {
    store.replaceReducer(reducerCombiner.combineReducers());
});




export {
    store,
    reducerCombiner
};
