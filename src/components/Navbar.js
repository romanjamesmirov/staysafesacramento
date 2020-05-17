import React, { Component } from 'react';
import { connect } from 'react-redux';
// Redux up top, router down bottom. 
import { Link } from 'react-router-dom';
import ProfileIcon from '../static/icons/profile-icon.svg';

// Links to other pages
class Navbar extends Component {
	render() {
		const { username } = this.props;
		return (<div className="Navbar">
			<Link to="/">StaySafeSacramento</Link>
			<Link to="/chats">Chats</Link>
			<Link to={!username ? '/login' : `/${username}`}
				state={!username ? { next: 'PROFILE' } : undefined}>
				<img src={ProfileIcon} alt='My profile' /></Link>
		</div >);
	}
}

// Connect redux to this component
const mapStateToProps = state => ({ username: state.data.username });
export default connect(mapStateToProps)(Navbar);