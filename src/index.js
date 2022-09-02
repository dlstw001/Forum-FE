import './styles/default.css'; // ES6
import * as serviceWorker from './serviceWorker';
import { createRoot } from 'react-dom/client';
import { Provider } from 'mobx-react';
import App from './App';
import React from 'react';
import stores from 'stores';
const root = createRoot(document.getElementById('root')); // createRoot(container!) if you use TypeScript

root.render(
  <Provider {...stores}>
    <App />
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
