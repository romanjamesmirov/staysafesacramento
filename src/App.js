// React, Router
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// App components
import Home from './components/Home';
import Chat from './components/Chat';
import Me from './components/Me';
import Register from './components/Register';
import Login from './components/Login';
import './static/styles/App.css';

export const App = () => (<BrowserRouter>
  <Switch>
    <Route path='/' component={Home} exact />
    <Route path='/me' component={Me} />
    <Route path='/register' component={Register} />
    <Route path='/login' component={Login} />
    <Route path='/:username' component={Chat} />
  </Switch>
</BrowserRouter>);

// RESOURCES
// #R1 react router – freecodecamp.org/news/react-router-in-5-minutes