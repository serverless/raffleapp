import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import Button from '../Button'
import styles from './styles.css' // eslint-disable-line
import { getHeaders } from './../utils';


class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      raffles: [],
      search: ''
    };
  }
  componentDidMount() {
    const config = {
      headers: getHeaders(),
    }
    console.log(config);
    axios.get('https://raffle.serverlessteam.com', config)
      .then(res => {
        console.log(res);
        const raffles = res.data;
        this.setState({ raffles })
      });
  }
  login = () => {
    this.props.auth.login();
  }
  handleSearch = (event) => {
    this.setState({
      search: event.target.value
    })
  }
  handleFocus = (event) => {
    event.target.select()
  }
  renderRaffles() {
    const { raffles, search } = this.state
    if (raffles.length) {
      const raffleItems = raffles.filter((item) => {
          return item.name.toLowerCase().indexOf(search) > -1 || item.name.indexOf(search) > -1
        }).map((raffle, i) => {
          const actualDate = new Date(raffle.createdAt)
          const dateString = actualDate.toDateString()
          const prettyDate = dateString.split(" ").filter((element, index) => {
            return index > 0
          }).join(" ")
          let winnerRender
          if (raffle.winner) {
            winnerRender = (
              <div className="raffleItemWinner">
                Winner: {raffle.winner}
              </div>
            )
          }
          return (
            <div key={i} className='zebra'>

                <div className="raffleItem">
                  <div>
                    <Link to={`/${raffle.shortcode}`}>
                    <div className="raffleItemName">
                      {raffle.name}
                    </div>
                    </Link>
                    <div className="raffleItemDate">
                      created {prettyDate}
                    </div>
                  </div>

                  <div className='getLinkWrapper'>
                    Share link: <input
                      className='getLink'
                      type='readonly'
                      readOnly
                      onFocus={this.handleFocus}
                      value={`${window.location.origin}/${raffle.shortcode}`}
                    />
                  </div>

                  {winnerRender}
                </div>
           </div>
        )
      })

      return (
        <div className="raffleList">
          {raffleItems}
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
          <div className="backdrop"></div>
          <div className="contents">
            <h1>Serverless Raffles</h1>
            <p>The 100% serverless raffle app
              <span className="tech">
                Built with AWS Lambda, DynamoDB, API Gateway & auth0
              </span>
              <span className="repo-link">
                <a href="https://github.com/serverless/raffleapp" target="_blank">
                  > Fork this on Github
                </a>
              </span>
            </p>
            <Button onClick={auth.login}>Admin Login</Button>
          </div>
        </div>
      )
    }
    return (
      <div className="raffle-admin">
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
