import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';

const apps = {
  'helloWorldReactApp': () => import('./react-components/mainpage'),
  'accountNavBar': () => import('./react-components/layout-components/account_navbar_component'),
};

const renderAppInElement = (el) => {
  el.classList.remove('loading');
  if (apps[el.id]) {
    apps[el.id]().then((App) => {
      render(<Provider store={store}><App.default {...el.dataset} /></Provider>, el);
    });
  }
};

document
  .querySelectorAll('.__react-root')
  .forEach(renderAppInElement);
