import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'; 
import { Link } from 'react-router-dom';

class AppBar extends Component {
	render() {
		return (<div className="AppBar">
			<Link to='/'>HomeIcon</Link>
			<Link to='/chats'>BellIcon – {this.props.numberUnread}</Link>
			<Link to='/'>ProfileIcon</Link>
		</div>);
	}
}

const mapStateToProps = state => ({ 
	numberUnread: state.data.numberUnread
});
export default connect(mapStateToProps)(AppBar); 