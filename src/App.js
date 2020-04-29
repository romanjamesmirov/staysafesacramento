import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter, Route, Switch } from 'react-router-dom'; //#
//  ▲  React, Redux, Router  ▼  App components
import PeopleList from './components/PeopleList';
import DirectChat from './components/DirectChat';
import Me from './components/Me';
import Register from './components/Register';
import Login from './components/Login';
import './static/styles/App.css';

export default class App extends Component {
  render() {
    return (
      <React.StrictMode>
        <Provider store={store}>
          <BrowserRouter>
            <Switch>
              <Route path='/' component={PeopleList} exact />
              <Route path='/chat' component={DirectChat} />
              <Route path='/me' component={Me} />
              <Route path='/register' component={Register} />
              <Route path='/login' component={Login} />
            </Switch>
          </BrowserRouter>
        </Provider>
      </React.StrictMode>
    );
  }
}

//# freecodecamp.org/news/react-router-in-5-minutes