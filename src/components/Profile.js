import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { SupplyIconsList } from './Supplies';

class Profile extends Component {
	constructor(props) {
		super(props);
		const { name, username, have, need } = this.props;
		this.state = {
			name, username, password: '', have, need,
			deletedRedirect: false
		};
		this.onDeleteClick = this.onDeleteClick.bind(this);
	}

	async onDeleteClick() {
		try {
			const headers = { Authorization: `Bearer ${this.props.token}` };
			const res = await fetch('/api/users/delete', { headers, method: 'DELETE' });
			if (res.status !== 200) throw new Error('Could not delete profile');
			this.setState({ deletedRedirect: true });
		} catch (error) { this.setState({ errorMessage: error.message }); }
	}

	render() {
		const { token, name, username, have, need } = this.props;
		if (!token) {
			const to = { pathname: '/login', state: { next: 'PROFILE' } };
			return <Redirect to={to} />;
		}
		return (<main id="Profile-page">
			<div id="Profile-h1-and-edit-button">
				<h1>{name}</h1>
				<button>Edit profile</button>
			</div>

			<p>@{username}</p>

			<div id="Profile-page-have-supplies">
				<h3>I have...</h3><SupplyIconsList supplies={have} /></div>

			<div id="Profile-page-need-supplies">
				<h3>I need...</h3><SupplyIconsList supplies={need} /></div>

			<button>Log out</button>

			<button onClick={this.onDeleteClick}>Delete account</button>
		</main>);
	}
}

const mapStateToProps = ({ data }) => {
	const { token, name, username, have, need } = data;
	return { token, name, username, have, need };
};
export default connect(mapStateToProps)(Profile);