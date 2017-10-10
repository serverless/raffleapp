import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Button from '../Button'
import styles from './styles.css' // eslint-disable-line
import HeroCard from '../HeroCard'
import { getHeaders } from '../utils';

class ShowRaffle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    }
  }
  handleRegister = () => {
    localStorage.setItem('raffle_sign_up', 'true')
    this.props.auth.login()
  }
  componentDidMount() {
    const shortcode = this.props.match.params.shortcode
    const config = {
      headers: getHeaders(),
    }
    axios.get(`https://raffle.serverlessteam.com/${shortcode}`, config)
      .then(res => {
        console.log(res.data)
        const raffle = res.data;
        this.setState({
          ...raffle,
          loading: false
        })
        const oneClickSignup = JSON.parse(localStorage.getItem('raffle_sign_up'))
        const node = document.getElementById('register')
        if (oneClickSignup && node) {
          node.click()
        }
      }).catch((error) => {
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
    // reset one click signup
    localStorage.setItem('raffle_sign_up', 'false')
    axios({
      url: url,
      method: 'post',
      headers: getHeaders(),
    }).then((response) => {
      console.log(response.data)
      // reset one click signup
      localStorage.setItem('raffle_sign_up', 'false')
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
  renderActions() {
    const { isRegistered } = this.state
    const authed = this.props.auth.isAuthenticated()

    if (isRegistered) {
      return null
    }

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
  }
  render() {
    const { name, entries, description, show404, isRegistered, admin } = this.state
    const { match } = this.props
    const authed = this.props.auth.isAuthenticated()
    const showName = name || '...'
    const entrantsCount = (entries) ? entries.length : 0
    if (show404) {
      return (
        <HeroCard
          title={'This raffle does not exist'}
          description={'Please refresh the page and try again'}
        />
      )
    }

    let beforeContent
    if (isRegistered) {
      beforeContent = (
        <h1 className="enteredText">
          🎉 You are entered into this raffle 🎉
        </h1>
      )
    }

    let afterContent
    if (authed && admin) {
      afterContent = (
        <div className="runRaffle">
          <Link to={`/${match.params.shortcode}/raffle`}>
            Pick a winner!
          </Link>
        </div>
      )
    }

    let entrantsRender
    if (entrantsCount) {
      entrantsRender = (
        <div className="raffleOdds">
          You have a 1 out of {entrantsCount} chance of winning
        </div>
      )
    }

    let contents = (
      <div>
        {entrantsRender}
      </div>
    )

    return (
      <HeroCard
        before={beforeContent}
        title={showName}
        description={description}
        contents={contents}
        actions={this.renderActions()}
        after={afterContent}
      />
    )
  }
}

export default ShowRaffle;
