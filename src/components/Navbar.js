import React, { Component } from 'react';
import { connect } from 'react-redux';
// Redux up top, router down bottom. 
import { Link } from 'react-router-dom';
import { HomeIcon, ChatIcon, ProfileIcon } from './Icons';

// Links to other pages
class Navbar extends Component {
	render() {
		const { username } = this.props;
		return (<div id="Navbar">
			<Link to="/"><HomeIcon /></Link>
			<Link to="/chats"><ChatIcon /></Link>
			<Link to={`/${!username ? 'login' : username}`}
				state={!username ? { next: 'PROFILE' } : undefined}
				title="Profile"><ProfileIcon /></Link>
		</div >);
	}
}

// Connect redux to this component
const mapStateToProps = state => ({ username: state.data.username });
export default connect(mapStateToProps)(Navbar);