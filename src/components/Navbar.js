import React, { Component } from 'react';
import { connect } from 'react-redux';
// Redux up top, router down bottom. 
import { NavLink } from 'react-router-dom';
import { HomeIcon, ChatIcon, ProfileIcon } from './Icons';

// Links to other pages
class Navbar extends Component {
	render() {
		const { username } = this.props;
		return (<div id="Navbar">
			<NavLink to="/" exact title="Home"><HomeIcon /></NavLink>
			<NavLink to="/chats" title="Chats"><ChatIcon /></NavLink>
			<NavLink to={`/${username ? username : 'signin'}`}
				state={!username ? { next: 'PROFILE' } : undefined}
				title="Profile" exact><ProfileIcon /></NavLink>
		</div>);
	}
}

// Connect redux to this component
const mapStateToProps = state => ({ username: state.data.username });
export default connect(mapStateToProps)(Navbar);