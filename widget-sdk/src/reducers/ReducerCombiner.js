import { combineReducers } from 'redux'

export default class ReducerCombiner {

    constructor(initialReducers = {}) {
        this.reducers = initialReducers;
        this.updateHandler = null;

        this.onUpdate = this.onUpdate.bind(this);
    }

    addReducer(key, reducer) {
        if (this.reducers[key]) {
            throw Error('Already existing reducer');
        }

        this.reducers[key] = reducer;
        if (reducer instanceof ReducerCombiner) {
            reducer.setUpdateHandler(this.onUpdate);
        }

        this.onUpdate();
    }

    removeReducer(key) {
        if (this.reducers[key]) {
            const reducer = this.reducers[key];
            delete this.reducers[key];
            if (reducer instanceof ReducerCombiner) {
                reducer.deleteUpdateHandler();
            }
        }

        this.onUpdate();
    }

    updateReducer(key, reducer) {
        this.reducers[key] = reducer;
        if (reducer instanceof ReducerCombiner) {
            reducer.setUpdateHandler(this.onUpdate);
        }

        this.onUpdate();
    }

    combineReducers() {
        const finalReducersKeys = Object.keys(this.reducers);
        const finalReducers = {};
        finalReducersKeys.forEach((key) => {
            const reducer = this.reducers[key];
            if (reducer instanceof ReducerCombiner) {
                finalReducers[key] = reducer.combineReducers();
            } else {
                finalReducers[key] = reducer;
            }
        });

        return combineReducers(finalReducersKeys);
    }

    setUpdateHandler(handler) {
        this.updateHandler = handler;
    }

    deleteUpdateHandler() {
        this.updateHandler = null;
    }

    onUpdate() {
        this.updateHandler && this.updateHandler();
    }
}