import React from 'react'
import { Route, Router, Switch, Redirect } from 'react-router-dom'
import App from './App'
import Home from './Home/Home'
import Login from './Login'
import Create from './Create'
import Callback from './Callback/Callback'
import ShowRaffle from './ShowRaffle/index'
import PickWinner from './PickWinner'
import Auth from './Auth/Auth'
import history from './history'

const auth = new Auth()

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication()
  }
}

export const makeMainRoutes = () => {
  const homeRedirect = <Redirect to="/" />
  const create = (props) => !auth.isAuthenticated() ? homeRedirect : <Create {...props} />
  const login = (props) => auth.isAuthenticated() ? homeRedirect : <Login auth={auth} {...props} />
  const runRaffle = (props) => !auth.isAuthenticated() ? homeRedirect : <PickWinner auth={auth} {...props} />
  // https://raffle.serverlessteam.com/%3Cshortcode%3E/entries
  // https://raffle.serverlessteam.com/<shortcode>/winner
  /*
  {
      "winner": "david@serverless.com",
  }
   */
  return (
      <Router history={history} component={App}>
        <div className="app-contents">
          <Route path="/" render={(props) => <App auth={auth} {...props} />} />
          <Switch>
            <Route path="/" exact render={(props) => <Home auth={auth} {...props} />} />
            <Route path="/login" exact render={login} />
            <Route path="/create" exact render={create} />
            <Route path="/callback" render={(props) => {
              handleAuthentication(props);
              return <Callback {...props} />
            }}/>
            <Route path="/:shortcode" exact render={(props) => <ShowRaffle auth={auth} {...props} />} />
            <Route path="/:shortcode/raffle" render={runRaffle} />
          </Switch>
        </div>
      </Router>
  );
}
