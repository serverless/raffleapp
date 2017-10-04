import React, {Component, PropTypes} from 'react'
import styles from './styles.css'

export default class Button extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <button onClick={this.props.onClick} className="button">
        {this.props.children}
      </button>
    )
  }
}
