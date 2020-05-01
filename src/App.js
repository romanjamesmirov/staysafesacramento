import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'; //#
//  ▲  React, Redux, Router  ▼  App components
import Users from './components';
import Chat from './components/Chat';
import Me from './components/Me';
import Register from './components/Register';
import Login from './components/Login';
import './static/styles/App.css';

export default function App() {
  return (<BrowserRouter>
    <Switch>
      <Route path='/' component={Users} exact />
      <Route path='/me' component={Me} />
      <Route path='/register' component={Register} />
      <Route path='/login' component={Login} />
      <Route path='/:username' component={Chat} />
    </Switch>
  </BrowserRouter>);
}

//# freecodecamp.org/news/react-router-in-5-minutes