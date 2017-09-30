import React, {Component} from 'react';

import style from './style.css';

export default class Label extends Component {
  render() {
    return(
      <label className = {style.label}>
        {this.props.text}
        {this.props.children}
      </label>
    )
  }
}
