import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import { SITE_CONFIG } from './../config';

export default class Create extends Component {
  constructor(props) {
    super(props);

    this.state = {
      success: false
    }
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
  render() {
    const { success } = this.state

    let successMsg

    if(success) {
      successMsg = (
        <div>Raffle Created!</div>
      )
    }

    return (
      <div className="content">
        <Link to="/">Back to list</Link>
        {successMsg}
        <form onSubmit={this.createRaffle}>
          <div>
            <input placeholder="Name of raffle" name='name' ref='name'></input>
          </div>
          <div>
            <input placeholder="raffle admins" name='admins' ref='admins'></input>
          </div>
          <button>Create New Raffle</button>
        </form>
      </div>
    );
  }
}
