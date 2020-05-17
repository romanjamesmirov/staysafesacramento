// React, Router
import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// App components
import Home from './components/Home';
import Chats from './components/Chats';
import Profile from './components/Profile';
import Chat from './components/Chat';
import Register from './components/Register';
import Login from './components/Login';
import './static/styles/App.css';

// Routes
const App = () => (<BrowserRouter>
  <Switch>
    <Route path='/' component={Home} exact />
    <Route path='/chats' component={Chats} />
    {this.props.username
      ? <Route path={`/${this.props.username}`} component={Profile} /> : null}
    <Route path='/:username' component={Chat} />
    <Route path='/register' component={Register} />
    <Route path='/login' component={Login} />
  </Switch>
</BrowserRouter>);

// Attach redux to this component
const mapStateToProps = state => ({
  username: state.data.username || undefined
});
export default connect(mapStateToProps)(App);

// RESOURCES
// #R1 react router – freecodecamp.org/news/react-router-in-5-minutes