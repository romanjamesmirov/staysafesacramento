import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

class Me extends Component {
	render() {
		return <Redirect to='/dude' />;
		const { token, name } = this.props;
		if (token === '') return <Redirect to='/register' />;
		return (<Fragment>
			<div>
				<Link to='/'>X</Link>
				{/* <Link to='/edit'><span>&#x2190;</span></Link> */}
			</div>
			<h1>{name}</h1>
		</Fragment>);
	}
}

const mapStateToProps = state => ({ username: state.data.username, token: state.data.token });
export default connect(mapStateToProps)(Me);