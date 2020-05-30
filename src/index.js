// React, Redux, Router
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import store from './redux/store';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// App components
import Home from './components/Home';
import Chats from './components/Chats';
import Profile from './components/Profile';
import Chat from './components/Chat';
import Register from './components/Register';
import Login from './components/Login';
import './index.css';
import NotFound from './components/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const mapStateToProps = state => ({ username: state.data.username });
const App = connect(mapStateToProps)(
  ({ username }) => (<BrowserRouter>
    <Navbar />
    <Switch>
      <Route path='/' component={Home} exact />
      <Route path='/chats' component={Chats} />
      {!username ? null :
        <Route path={`/${username}`} component={Profile} />}
      <Route path='/register' component={Register} />
      <Route path='/login' component={Login} />
      <Route path='/:username' component={Chat} />
      <Route component={NotFound} />
    </Switch>
    <Footer />
  </BrowserRouter>)
);

ReactDOM.render(<React.StrictMode><Provider store={store}><App /></Provider></React.StrictMode>, document.getElementById('root'));