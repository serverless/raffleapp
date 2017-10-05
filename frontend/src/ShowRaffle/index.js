import React, { Component } from 'react'
import axios from 'axios'
import queryString from 'query-string'
import { Link } from 'react-router-dom'
import Button from '../Button'
import { SITE_CONFIG } from './../config'
import styles from './styles.css'
import HeroCard from '../HeroCard'

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
    const parsed = queryString.parse(location.search)
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
  renderActions() {
    const { auth } = this.props
    const { isRegistered, authed } = this.state

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
    const { name, entries, description, show404, isRegistered, authed } = this.state
    const { match } = this.props
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
    if (authed) {
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
