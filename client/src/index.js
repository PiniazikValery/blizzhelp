import 'babel-polyfill';
import 'isomorphic-fetch';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';

const apps = {
  'helloWorldReactApp': () => import('./react-components/mainpage'),
  'accountNavBar': () => import('./react-components/layout-components/account-components/account_navbar_component'),
};

const renderAppInElement = (el) => {
  el.classList.remove('loading');
  if (apps[el.id]) {
    apps[el.id]().then((App) => {
      render(<Provider store={store}><PersistGate loading={null} persistor={persistor}><App.default {...el.dataset} /></PersistGate></Provider>, el);
    });
  }
};

const reactApps = document.querySelectorAll('.__react-root');

for (let i = 0; i < reactApps.length; i += 1) {
  renderAppInElement(reactApps[i]);
}
