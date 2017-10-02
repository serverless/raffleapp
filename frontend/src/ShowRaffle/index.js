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

    this.state = {
      raffle: {}
    };
  }
  componentDidMount() {
    const shortcode = this.props.match.params.shortcode;
    instance.get(`${shortcode}`)
      .then(res => {
        const raffle = res.data;
        this.setState({ raffle })
      })
      .catch(error => {
        if (error.response.status === 404) {
          const raffle = {
            exists: false,
          }
          this.setState({ raffle })
        }
      })
  }
  registerButton() {
    if (this.state.raffle && this.state.raffle.registered === false) {
      return <h3>Please make me into a 'REGISTER' button!</h3>
    }
  }
  showRaffle() {
    if (this.state.raffle && this.state.raffle.exists !== false) {
      return (
        <div>
          <h3>Raffle Details:</h3>
          <ul>
            <li>Name: {this.state.raffle.name}</li>
            <li>Shortcode: {this.state.raffle.shortcode}</li>
            <li>Created at: {this.state.raffle.created_at}</li>
            <li>Are you registered: { (this.state.raffle.registered) ? 'Yes' : 'No' } </li>
            <li>Are you an admin: { (this.state.raffle.admin) ? 'Yes' : 'No' }</li>
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
      </div>
    );
  }
}

export default ShowRaffle;
