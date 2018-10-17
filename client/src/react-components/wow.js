import React from 'react';
import { render } from 'react-dom';

const WowPageComponent = () => (
  <h1>It is wow page ,i am react</h1>
);

render(<WowPageComponent />, document.getElementById('App'));

export default WowPageComponent;
