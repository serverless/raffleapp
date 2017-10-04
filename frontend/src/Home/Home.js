import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import Button from '../Button'
import styles from './styles.css' // eslint-disable-line
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
      raffles: [],
      search: ''
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
  handleSearch = (event) => {
    this.setState({
      search: event.target.value
    })
  }
  renderRaffles() {
    const { raffles, search } = this.state
    if (raffles.length) {
      return (
        <div className="raffleList">
          { raffles.filter((item) => {
              return item.name.toLowerCase().indexOf(search) > -1 || item.name.indexOf(search) > -1
            }).map((raffle, i) =>
            <div className="raffleItem" key={i}>
              <div>
                <Link to={`/${raffle.shortcode}`}>{raffle.name}</Link>
              </div>
              <span>{raffle.createdAt}</span>
              <div>Winner: {raffle.winner}</div>
              <div>share link: http:blah{raffle.shortcode}</div>
            </div>
          )}
        </div>
      )
    } else {
      return (
        <h1>No Raffles for you.</h1>
      )
    }
  }
  render() {
    const { auth } = this.props
    if (!auth.isAuthenticated()) {
      return (
        <div className="landing-page">
          <div className="contents">
            <h1>Serverless Raffles</h1>
            <p>The 100% serverless raffle app for picking the winners!</p>
            <Button>Clone the repo</Button>
          </div>
        </div>
      );
    }
    return (
      <div className="content">
        <div className="actions">
          <div className="searchWrapper">
            <input
              onChange={this.handleSearch}
              className="search"
              type="text"
              placeholder="Search raffles"
            />
          </div>
          <Link className='create-button' to='/create'>create new raffle</Link>
        </div>
        {this.renderRaffles()}
      </div>
    );
  }
}

export default Home;
