import React, { Component } from 'react'
import axios from 'axios'
import queryString from 'query-string'
import { Link } from 'react-router-dom'
import Button from '../Button'
import { SITE_CONFIG } from './../config'
import styles from './styles.css'


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
      loading: true,
      authed: props.auth.isAuthenticated()
    }
  }
  handleRegister = () => {
    this.props.auth.login(true)
  }
  componentDidMount() {
    const parsed = queryString.parse(location.search);
    console.log(parsed);

    const shortcode = this.props.match.params.shortcode;
    instance.get(`${shortcode}`)
      .then(res => {
        console.log(res.data)
        const raffle = res.data;
        this.setState({
          ...raffle,
          loading: false
        })
        const node = document.getElementById('register')
        if (parsed.register && node) {
          node.click()
        }
      })
      .catch(error => {
        console.log(error)
        if (error.response.status === 404) {
          this.setState({
            show404: true,
            loading: false
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
    const { isRegistered, authed } = this.state

    if(!authed) {
      return (
        <Button onClick={this.handleRegister}>
         Enter Raffle
        </Button>
      )
    }

    if (isRegistered === false) {
      return (
        <Button id="register" onClick={this.enterRaffle}>
          Enter Raffle
        </Button>
      )
    }

    if (isRegistered) {
      return (
        <div>You are entered into the raffle</div>
      )
    }
  }
  showRaffle() {
    const { name, entries, description, show404 } = this.state
    const showName = name || '...'
    const entrantsCount = (entries) ? entries.length : 0

    if (show404) {
      return (
        <div>
          <h3>Raffle does not exist.</h3>
        </div>
      )
    }

    let entrantsRender
    if (entrantsCount) {
      entrantsRender = (
        <div className="raffleEntrants">
          You have a 1 in {entrantsCount} chance of winning
        </div>
      )
    }

    let descriptionRender
    if (description) {
      descriptionRender = (
        <div className="raffleDescription">
          {description}
        </div>
      )
    }

    return (
      <div className='raffleDetails'>
        <div className='raffleDetailsInner'>
          <h1>
            Raffle {showName}
          </h1>
          <div className="raffleMeta">
            {descriptionRender}
            {entrantsRender}
          </div>
        </div>
        <div className="raffleButtonWrapper">
          {this.registerButton()}
        </div>
      </div>
    )
  }
  render() {
    const { match } = this.props
    const { authed } = this.state
    let extra
    if (authed) {
      extra = (
        <div className="runRaffle">
          <Link to={`/${match.params.shortcode}/raffle`}>
            Pick a winner!
          </Link>
        </div>
      )
    }
    return (
      <div className="raffleWrapper">
        {this.showRaffle()}
        {extra}
      </div>
    );
  }
}

export default ShowRaffle;
