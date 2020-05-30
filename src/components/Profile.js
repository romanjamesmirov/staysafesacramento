import React, { Component } from 'react';
import { connect } from 'react-redux';
// Redux up top, router down bottom
import { Redirect } from 'react-router-dom';

// React boilerplate
class Me extends Component {
	constructor(props) {
		super(props);
		const { name, username, have, need } = this.props;
		this.state = { name, username, password: '', have, need };
	}

	// The GUI
	render() {
		const { token, name } = this.props;
		if (!token) {
			const to = { pathname: '/login', state: { next: 'PROFILE' } };
			return <Redirect to={to} />;
		}
		return (<main>
			<div><button>Edit profile</button></div>
			<h1>{name}</h1>
			<div><button>Log out</button></div>
			<div><button>Delete account</button></div>
		</main>);
	}
}

// Connect redux to this component
const mapStateToProps = state => ({
	name: state.data.name, token: state.data.token
});
export default connect(mapStateToProps)(Me);