import React, { Component } from 'react';
import axios from 'axios';
import { SITE_CONFIG } from './../config';


const instance = axios.create({
  baseURL: SITE_CONFIG.raffleDomain,
  headers: {
    'Authorization': SITE_CONFIG.auth
  }
})

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      raffles: []
    };
  }
  componentDidMount() {
    instance.get('')
      .then(res => {
        console.log(res);
        const raffles = res.data;
        this.setState({ raffles })
      });
  }
  login() {
    this.props.auth.login();
  }
  renderRaffles() {
    if (this.state.raffles.length) {
      return (
        <ul>
          { this.state.raffles.map(raffle => 
            <li><a href={`/raffle/${raffle.shortcode}`}>{raffle.name}</a></li>
          )}
        </ul>
      )
    } else {
      return (
        <h1>No Raffles for you.</h1>
      )
    }
  }
  render() {
    return (
      <div className="content">
        { this.renderRaffles() }
      </div>
    );
  }
}

export default Home;
