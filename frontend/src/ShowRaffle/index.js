import React, { Component } from 'react';
import axios from 'axios';
import { SITE_CONFIG } from './../config';


const instance = axios.create({
  baseURL: SITE_CONFIG.raffleDomain,
  headers: {
    'Authorization': SITE_CONFIG.auth
  }
})

class ShowRaffle extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  componentDidMount() {
    const shortcode = this.props.match.params.shortcode;
    instance.get(`${shortcode}`)
      .then(res => {
        console.log(res.data)
        const raffle = res.data;
        this.setState(raffle)
      })
      .catch(error => {
        if (error.response.status === 404) {
          this.setState({
            exists: false,
          })
        }
      })
  }
  enterRaffle = () => {
    const id = this.props.match.params.shortcode
    const url = `https://raffle.serverlessteam.com/${id}/register`
    axios({
      url: url,
      method: 'post',
      headers: {
        'Authorization': SITE_CONFIG.auth
      }
    }).then((response) => {
      console.log(response)
      this.setState({
        isRegistered: true
      })
      return response.data
    }).catch((e) => {
      // this.setState({
      //   isRegistered: f
      // })
    })
  }
  registerButton() {
    const { auth } = this.props
    const { isRegistered } = this.state

    if(!auth.isAuthenticated()) {
      return (
        <button onClick={auth.login}>
          Login and Register
        </button>
      )
    }

    if (isRegistered === false) {
      return (
        <button onClick={this.enterRaffle}>
          Register
        </button>
      )
    }
  }
  showRaffle() {
    console.log(this.state)
    if (this.state.exists !== false) {
      return (
        <div>
          <h3>Raffle Details:</h3>
          <ul>
            <li>Name: {this.state.name}</li>
            <li>Shortcode: {this.state.shortcode}</li>
            <li>Created at: {this.state.created_at}</li>
            <li>Are you registered: { (this.state.isRegistered) ? 'Yes' : 'No' } </li>
            <li>Are you an admin: { (this.state.admin) ? 'Yes' : 'No' }</li>
          </ul>
        </div>
      )
    } else {
      return (
        <div>
          <h3>Raffle does not exist.</h3>
        </div>
      )
    }
  }
  render() {
    return (
      <div className="content">
          <h2>
          You're using raffle {this.props.match.params.shortcode}!
          </h2>
          { this.showRaffle() }
          { this.registerButton() }
          <div>Run raffle(admin)</div>
      </div>
    );
  }
}

export default ShowRaffle;
