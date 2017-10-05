import React from 'react'
import styles from './styles.css' // eslint-disable-line

const Button = (props) => {
  return (
    <button onClick={props.onClick} className="button" {...props}>
      {props.children}
    </button>
  )
}

export default Button
