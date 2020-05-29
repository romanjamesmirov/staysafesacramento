// React, Redux, Router
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import store from './redux/store';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// App components
import Home from './components/Home';
import Contacts from './components/Contacts';
import Profile from './components/Profile';
import Chat from './components/Chat';
import Register from './components/Register';
import Login from './components/Login';
import './index.css';

const mapStateToProps = state => ({ username: state.data.username });
const App = connect(mapStateToProps)(
  ({ username }) => (<BrowserRouter>
    <Switch>
      <Route path='/' component={Home} exact />
      <Route path='/contacts' component={Contacts} />
      {!username ? null :
        <Route path={`/${this.props.username}`} component={Profile} />}
      <Route path='/:username' component={Chat} />
      <Route path='/register' component={Register} />
      <Route path='/login' component={Login} />
    </Switch>
  </BrowserRouter>)
);

ReactDOM.render(<React.StrictMode><Provider store={store}><App /></Provider></React.StrictMode>, document.getElementById('root'));