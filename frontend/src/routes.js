import React from 'react';
import { Route, Router, Switch, Redirect } from 'react-router-dom';
import App from './App';
import Home from './Home/Home';
import Create from './Create';
import Callback from './Callback/Callback';
import ShowRaffle from './ShowRaffle/index';
import Auth from './Auth/Auth';
import history from './history';

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
}

export const makeMainRoutes = () => {
  const homeRedirect = <Redirect to="/" />
  const create = (props) => !auth.isAuthenticated() ? homeRedirect : <Create {...props} />
  return (
      <Router history={history} component={App}>
        <div>
          <Route path="/" render={(props) => <App auth={auth} {...props} />} />
          <Switch>
            <Route path="/" exact render={(props) => <Home auth={auth} {...props} />} />
            <Route path="/create" exact render={create} />
            <Route path="/callback" render={(props) => {
              handleAuthentication(props);
              return <Callback {...props} />
            }}/>
            <Route path="/:shortcode" render={(props) => <ShowRaffle auth={auth} {...props} />} />
          </Switch>
        </div>
      </Router>
  );
}
