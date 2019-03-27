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
  'registrationForm': () => import('./react-components/registration-components/registration_component'),
  'mainNotificator': () => import('./react-components/layout-components/notification-components/notifications-component'),
  'unauthorizedHandler': () => import('./react-components/error-handler-components/unauthorized_handler_component'),
  'listOfArticlesComponent': () => import('./react-components/blog-components/list_of_articles_component'),
  'createArticleComponent': () => import('./react-components/blog-components/manage_article_components/create_article_component'),
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
