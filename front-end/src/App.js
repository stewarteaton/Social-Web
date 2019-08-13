import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import themeFile from './util/theme';
import jwtDecode from 'jwt-decode';
// Redux 
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';

// Components
import Navbar from './components/layout/Navbar';
import AuthRoute from './util/AuthRoute';

//Pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';
import user from './pages/user';
import axios from 'axios';

// so proxy base api url works outside of development stage // sol to problem with live-server in production build
axios.defaults.baseURL = 'https://us-central1-socialweb-4fb98.cloudfunctions.net/api'; 

// css styles for all components
const theme = createMuiTheme(themeFile);

const token = localStorage.FBIdToken;
if(token){
  const decodedToken = jwtDecode(token);
  // becauase token is given in seconds, 
  if(decodedToken.exp * 1000 < Date.now()){
    store.dispatch(logoutUser()); // logs out user if token is expired
    window.location.href = '/login';
    // authenticated = false;
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token; // sets auth to remembered token
    store.dispatch(getUserData());
    // authenticated = true;
  }
} else console.log("** NO Token **");

class App extends Component{
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        {/* Redux store wrapper can be inside or outside of MuiTheme */}
      <Provider store={store}>    
        <div className="App">
          <Router>
            <Navbar/>
              <div className="container">
                <Switch>
                  <Route exact path="/" component={home}/>
                  <AuthRoute exact path="/login" component={login}  />
                  <AuthRoute exact path="/signup" component={signup}  />
                  <Route exact path='/users/:handle' component={user} />
                  <Route exact path='/users/:handle/shout/:shoutID' component={user} />
              </Switch>
              </div>
          </Router>
        </div>
      </Provider>
      </MuiThemeProvider>
    )
  }
}


export default App;
