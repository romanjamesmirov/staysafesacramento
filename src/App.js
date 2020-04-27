import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'; // freecodecamp.org/news/react-router-in-5-minutes
import PeopleList from './components/PeopleList';
import DirectChat from './components/DirectChat';
import Me from './components/Me';
import Register from './components/Register';
import './static/styles/App.css';

export default class App extends Component {
  render() {
    return (
      <Switch>
        <Route path='/' component={PeopleList} exact />
        <Route path='/chat' component={DirectChat} />
        <Route path='/me' component={Me} />
        <Route path='/register' component={Register} />
      </Switch>
    );
  }
}