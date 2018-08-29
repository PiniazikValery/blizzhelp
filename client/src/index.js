import React from 'react';
import { render } from 'react-dom';

const apps = {
  'helloWorldReactApp': () => import('./react/mainpage'),
};

const renderAppInElement = (el) => {
  if (apps[el.id]) {
    apps[el.id]().then((App) => {
      render(<App.default {...el.dataset} />, el);
    });
  }
};

document
  .querySelectorAll('.__react-root')
  .forEach(renderAppInElement);
