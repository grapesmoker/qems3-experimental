import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import "@webcomponents/custom-elements/custom-elements.min.js";
import "@clr/icons/clr-icons.css";
import "@clr/icons/clr-icons-lite.min.js";
import "@clr/icons/shapes/technology-shapes.js";


ReactDOM.render(
  <React.StrictMode>
    <Provider store={ store }>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
