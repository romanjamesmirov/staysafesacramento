// React, Router
import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// App components
import Home from './components/Home';
import Chat from './components/Chat';
import Me from './components/Me';
import Register from './components/Register';
import Login from './components/Login';
import './static/styles/App.css';

const App = () => (<BrowserRouter>
  <Switch>
    <Route path='/' component={Home} exact />
    <Route path='/register' component={Register} />
    <Route path='/login' component={Login} />
    {this.props.username
      ? <Route path={`/${this.props.username}`} component={Me} /> : undefined}
    <Route path='/:username' component={Chat} />
  </Switch>
</BrowserRouter>);

const mapStateToProps = state => ({ 
  username: state.data.username || undefined
});
export default connect(mapStateToProps)(App); 

// RESOURCES
// #R1 react router – freecodecamp.org/news/react-router-in-5-minutes