import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import HeroCard from '../HeroCard'
import Button from '../Button'

export default class Login extends Component {
  constructor(props) {
    super(props)
  }
  login = () => {
    this.props.auth.login();
  }
  render() {
    const { match, auth } = this.props

    const actions = (
      <Button onClick={this.login}>
        Login
      </Button>
    )

    return (
      <HeroCard
        title={'Admin Login'}
        actions={actions}
      />
    )
  }
}
