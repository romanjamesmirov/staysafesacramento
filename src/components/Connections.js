import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import Register from './Register';

class Connections extends Component {
	render() {
		if (!this.props.token) return (<Redirect to={{
			pathname: '/login', state: { goal: 'to see your chats', next: `/chats` }
		}} />);

		return (<Fragment>

		</Fragment>);
	}
}