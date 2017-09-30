import React, {Component} from 'react';

import style from './style.css';

export default class Box extends Component {
  render() {
    return (
      <div className = {style.container}>
        <div className = {style.box}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
