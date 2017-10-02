import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
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
          { this.state.raffles.map((raffle, i) =>
            <li key={i}>
              <div>
                <a href={`/${raffle.shortcode}`}>{raffle.name}</a>
                <span>{raffle.createdAt}</span>
              </div>
              <div>Winner: blah</div>
              <div>share link: http:blah{raffle.shortcode}</div>
            </li>
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
    const { auth } = this.props
    let createLink
    let listOfRaffles
    if (auth.isAuthenticated()) {
      createLink = (
        <Link className='create-button' to='/create'>create new raffle</Link>
      )
      listOfRaffles = this.renderRaffles()
    }
    return (
      <div className="content">
        {createLink}
        {listOfRaffles}
      </div>
    );
  }
}

export default Home;
