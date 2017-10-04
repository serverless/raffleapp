import React, { Component } from 'react';
import axios from 'axios';
import Button from '../Button'
import { SITE_CONFIG } from './../config';
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
      loading: true
    }
  }
  componentDidMount() {
    const shortcode = this.props.match.params.shortcode;
    instance.get(`${shortcode}`)
      .then(res => {
        console.log(res.data)
        const raffle = res.data;
        this.setState({
          ...raffle,
          loading: false
        })
      })
      .catch(error => {
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
    const { isRegistered } = this.state

    if(!auth.isAuthenticated()) {
      return (
        <Button onClick={auth.login}>
          Login and Enter Raffle
        </Button>
      )
    }

    if (isRegistered === false) {
      return (
        <Button onClick={this.enterRaffle}>
          Enter Raffle
        </Button>
      )
    }
  }
  showRaffle() {
    const { name, entries } = this.state
    const showName = name || '...'
    if (this.state.show404) {
      return (
        <div>
          <h3>Raffle does not exist.</h3>
        </div>
      )
    }
    const length = (entries) ? entries.length : 0
    return (
      <div className='raffleDetails'>
        <h1>
          Raffle {showName}
        </h1>
        <div className="raffleMeta">
           Created at: {this.state.createdAt} | Entrants {length}
        </div>
        <div className="raffleButtonWrapper" >
          {this.registerButton()}
        </div>
      </div>
    )
  }
  render() {

    return (
      <div className="raffleWrapper">
          {this.showRaffle()}
      </div>
    );
  }
}

export default ShowRaffle;
