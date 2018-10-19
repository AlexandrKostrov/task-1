import React from 'react';

export default function chatHoc(Component) {
  return class extends React.Component {
    componentDidMount() {
      this.props.initialState();
      this.props.requestUserList();
      this.props.initUser();
      this.props.ban();
      this.props.unban();
      this.props.responseUserList();
      this.props.responseGetAllUsers();
      this.props.mute();
      this.props.unmute();
      this.props.recivingMessage();
    }

    componentWillUnmount() {
      this.props.disconnect();
    }

    render() {
      return <Component {...this.props} />;
    }
  };
}
