import React, { Component } from 'react';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import notificators from './notificators';

class Notification extends Component {
  constructor(props) {
    super(props);
    this.showError = this.showError.bind(this);
    this.notificationDOMRef = React.createRef();
    notificators.mainNotificator = this;
  }

  showError(_message) {
    this.notificationDOMRef.current.addNotification({
      title: 'Error',
      message: _message,
      width: 500,
      type: 'danger',
      insert: 'top',
      container: 'bottom-right',
      animationIn: ['animated', 'fadeIn'],
      animationOut: ['animated', 'fadeOut'],
      dismiss: { duration: 3000 },
      dismissable: { click: true },
    });
  }

  showSuccess(_message) {
    this.notificationDOMRef.current.addNotification({
      title: 'Success',
      message: _message,
      width: 500,
      type: 'success',
      insert: 'top',
      container: 'bottom-right',
      animationIn: ['animated', 'fadeIn'],
      animationOut: ['animated', 'fadeOut'],
      dismiss: { duration: 3000 },
      dismissable: { click: true },
    });
  }

  showWarning(_message) {
    this.notificationDOMRef.current.addNotification({
      title: 'Warning',
      message: _message,
      width: 500,
      type: 'warning',
      insert: 'top',
      container: 'bottom-right',
      animationIn: ['animated', 'fadeIn'],
      animationOut: ['animated', 'fadeOut'],
      dismiss: { duration: 3000 },
      dismissable: { click: true },
    });
  }

  showInfo(_message) {
    this.notificationDOMRef.current.addNotification({
      title: 'Info',
      message: _message,
      width: 500,
      type: 'info',
      insert: 'top',
      container: 'bottom-right',
      animationIn: ['animated', 'fadeIn'],
      animationOut: ['animated', 'fadeOut'],
      dismiss: { duration: 3000 },
      dismissable: { click: true },
    });
  }

  render() {
    return (
      <ReactNotification ref={this.notificationDOMRef} />
    );
  }
}

export default Notification;
