import React from "react";
import ReactDOM from "react-dom";

import App from './App'
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./reducers/rootReducer";

import "./scss/custom.scss";

let store;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true, traceLimit: 25 });

    store = createStore(rootReducer, composeEnhancers());
} else {
    store = createStore(rootReducer);
}





ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.querySelector('#root'));