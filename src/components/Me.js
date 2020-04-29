import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class Me extends Component {
	render() {
		const { token, name } = this.props.user;
		if (token === '') return <Redirect to='/register' />;
		return (<Fragment>
			<h1>{name}</h1>
		</Fragment>);
	}
}

const mapStateToProps = state => ({ user: state.user });
export default connect(mapStateToProps)(Me);