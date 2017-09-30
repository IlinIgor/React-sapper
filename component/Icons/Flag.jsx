import React from 'react';

export default class Flag extends React.Component {
    render() {
        return(
            <svg viewBox="0 0 24 24" {...this.props}>
                <path d="M4 24h-2v-24h2v24zm18-16l-16-6v12l16-6z"/>
            </svg>
        );
    }
}
