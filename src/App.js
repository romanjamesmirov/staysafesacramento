import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getUsers } from './actions/userActions';
import { BrowserRouter, Route, Switch } from 'react-router-dom'; //#
//  ▲  React, Redux, Router  ▼  App components
import PeopleList from './components/PeopleList';
import DirectChat from './components/DirectChat';
import Me from './components/Me';
import Register from './components/Register';
import Login from './components/Login';
import './static/styles/App.css';

class App extends Component {
  componentDidMount() { this.props.getUsers(); }

  render() {
    return (<BrowserRouter>
      <Switch>
        <Route path='/' component={PeopleList} exact />
        <Route path='/me' component={Me} />
        <Route path='/register' component={Register} />
        <Route path='/login' component={Login} />
        <Route path='/:username' component={DirectChat} />
      </Switch>
    </BrowserRouter>);
  }
}

PeopleList.propTypes = { getUsers: PropTypes.func.isRequired };
export default connect(null, { getUsers })(App);

//# freecodecamp.org/news/react-router-in-5-minutes