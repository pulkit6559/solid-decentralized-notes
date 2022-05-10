import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';


ReactDOM.render((
    <div>
    <BrowserRouter>
    <App />
  </BrowserRouter>
  </div>
), document.getElementById('root'));

registerServiceWorker();


/*
 Main things still TODO:

 add tests
 package and send. (github??)`
 autoselect 1st element if there is one.
 */