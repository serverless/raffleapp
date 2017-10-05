import React from 'react'
import HeroCard from '../HeroCard'
import Button from '../Button'

const Login = (props) => {
  const actions = (
    <Button onClick={props.auth.login}>
      Login
    </Button>
  )
  return (
    <HeroCard
      title={'Admin Login'}
      actions={actions}
    />
  );
}

export default Login
