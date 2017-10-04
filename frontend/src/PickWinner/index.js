import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import { SITE_CONFIG } from './../config';

const colors = ['#c90000', '#c9c90e', '#336999', '#33996f']
const skip = 4
let counter = 0

export default class PickWinner extends Component {
  constructor(props) {
    super(props);
    this.state = {
     loading: false,
     entrants: [
       'austen@powers.com',
       'jimmy@hendricks.com',
       'donald@trump.com',
       'lolz@hazcats.com',
       'whooot@wooooo.com',
       'bill@murray.com',
       'lilwayne@rapper.net',
       'blade@vampire.net',
       'peter@griffen.com',
       'pleasePickMe@desperate.com',
       'hillary@clinton.com',
       'william@wallace.com',
       'loadingState@emails.com',
       'what@hi.com'
      ]
    }
  }
  swap = () => {
    const { entrants } = this.state
    if (!entrants) {
      return false
    }
    if(counter++ == skip) { // eslint-disable-line
      var randWord = entrants[Math.floor(Math.random()*entrants.length)]
      this.refs.winner.innerHTML = randWord;
      this.refs.winner.style.color = colors[Math.floor(Math.random()*colors.length)]
      this.refs.winner.dataset.text = randWord;
      counter = 0;
    }

    window.requestAnimationFrame(this.swap);
  }
  doRaffle = (e) => {
    const { match } = this.props
    e && e.preventDefault()

    // Rotate emails
    this.setState({
      loading: true
    }, () => {
      this.swap()
    })

    axios({
      method: 'get', // TODO needs to be post
      url: `https://raffle.serverlessteam.com/${match.params.shortcode}/entries`,
      headers: {
        'Authorization': SITE_CONFIG.auth
      }
    }).then((response) => {
      console.log('response', response)
      const data = response.data
      // const emails = data.emails
      const emails = ['bill@wooohoo.biz', 'steve@what.bike']
      if (false && data && emails && emails.length === 0) {
        this.setState({
          loading: false,
          entrants: null,
          winner: 'No entrants found. Refresh page & try again'
        })
        // document.querySelectorAll("button")[0].style.display = 'none'
        return false
      }

      this.setState({
        entrants: emails,
        // entrants: data.emails,
      })
      const winner = emails[Math.floor(Math.random()*emails.length)]
      setTimeout(() => {
        this.setState({
          tempEntrants: emails,
          entrants: null,
          winner: winner,
          loading: false,
        })
        this.refs.winner.style.color = '#07d907'
      }, 7000)
    }).catch((e) => {
      console.log(e)
    })
  }
  createRaffle = (e) => {
    e.preventDefault()
    const name = this.refs.name.value
    let admins = this.refs.admins.value

    if (!name || !admins) {
      return alert('please add name or admins')
    }
    // make array
    admins = admins.split(',').map((item) => item.trim())
    // save data
    axios({
      url: 'https://raffle.serverlessteam.com/create',
      method: 'post',
      data: {
        name: name,
        admins: admins
      },
      headers: {
        'Authorization': SITE_CONFIG.auth
      }
    }).then((x) => {
      console.log('x', x)
      this.setState({
        success: true
      }, () => {
        this.refs.name.value = ''
        this.refs.admins.value = ''
      })
    }).catch((e) => {
      console.log(e)
    })
  }
  hammerTime() {
    const { loading, winner } = this.state
    const showLoading = (loading) ? 'block' : 'none'
    const showWinner = (winner) ? 'block' : 'none'
    return (
      <div className='gif'>
        <iframe style={{display: showWinner}} src="//giphy.com/embed/l3q2Z6S6n38zjPswo" width="330" height="248" frameBorder="0" className="giphy-embed" allowFullScreen></iframe>
        <iframe style={{display: showLoading}}  src="//giphy.com/embed/hxc32veg6tbqg" width="330" height="248" frameBorder="0" className="giphy-embed" allowFullScreen></iframe>
      </div>
    )
  }
  render() {
    const { match } = this.props
    const { loading, winner } = this.state
    const buttonText = (loading) ? "Calculating Winner..." : "Spin the wheel of destiny"
    const headline = (winner) ? winner : "Raffle"

    return (
      <div className="content">
        <Link to={`/${match.params.shortcode}`}>Back to raffle</Link>
        Pick the winner
        <h1 className="title" ref='winner'>
          {headline}
        </h1>
        <button ref='button' onClick={this.doRaffle}>
          {buttonText}
        </button>
      </div>
    );
  }
}
