import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import user from './store/reducer'
import {createStore} from 'redux';
import {Provider} from 'react-redux';

const store = createStore(user);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
        <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
