import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './App.css';

class App extends Component {
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }

  login = () => {
    this.props.auth.login();
  }

  logout = () => {
    this.props.auth.logout();
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    let navLink = <img alt="Serverless logo" src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/logos/serverless-logo.svg"/>

    // if(isAuthenticated()) {
      navLink = (
        <Link to='/'>
          <img alt="Serverless logo" src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/logos/serverless-logo.svg"/>
        </Link>
      )
    // }

    return (
      <div className="App">
        <div className='nav'>
          <div className='nav-bg'></div>
          <div className="left-nav">
            <div className="logo">
              {navLink}
            </div>
          </div>
          <div className="logoText">
            <img alt="Serverless" src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/logos/serverless_text_white.svg"/>
          </div>
          <div className="nav-email">
            <p>alex@serverless.com</p>
          </div>
          <div className="right-nav">
          { isAuthenticated()
           ? <button className="authButton" onClick={this.logout}>Logout</button>
           :  <button className="authButton" onClick={this.login}>Login</button>
          }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
