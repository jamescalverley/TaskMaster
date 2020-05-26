import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import user from './store/reducer'
import {createStore,applyMiddleware,compose} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

const logger = store => {
    
    return next => {
        
        return action => {
            console.log('MIDDLEWARE current state',store.getState());
            console.log('[MIDDLEWARE] dispatching action',action);
            const result = next(action);
            console.log('MIDDLEWARE next state',store.getState());
            return result;
        }
    }
}
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION__  || compose;
const store = createStore(user,composeEnhancer(applyMiddleware(logger,thunk)));

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
        <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
