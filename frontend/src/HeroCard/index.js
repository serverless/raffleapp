import React, { Component } from 'react'
import styles from './styles.css'

export default class HeroCard extends Component {
  render() {
    const { title, description, contents, actions, after, before } = this.props
    return (
      <div className="heroCardWrapper">
        <div className="heroCardOuter">
          { before }
          <div className="heroCard">
            <div className='heroCardContents'>
              <div className='heroCardContentsInner'>
                { title && <h1>{title}</h1>}
                { description && <div className="heroCardDescription">{description}</div>}
                { contents && <div className="heroCardContents">{contents}</div>}
              </div>
            </div>
            <div className="heroCardActions">
              {actions}
            </div>
          </div>
          { after }
        </div>
      </div>
    );
  }
}
