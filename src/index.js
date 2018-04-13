import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from './store/configureStore';
import WebFont from 'webfontloader';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import App from './containers/App';
import 'semantic-ui-css/semantic.min.css';


const {
  REACT_APP_URL_BASE = '/'
} = process.env;

WebFont.load({
  google: {
    families: ['Open+Sans:300,300i,400,400i,600,600i,700,700i', 'Material+Icons']
  },
  fontinactive: function (familyName) {
    if (familyName === 'Material Icons') {
      require('material-design-icons/iconfont/material-icons.css');
    }
  }
});


ReactDOM.render(
  <Provider store={store}>
  <BrowserRouter basename={REACT_APP_URL_BASE}>
    <App/>
  </BrowserRouter>
</Provider>, document.getElementById('root'));

registerServiceWorker();
