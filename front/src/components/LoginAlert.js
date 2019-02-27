import React, { Component } from 'react'
import '../css/style.css'
import { Redirect, Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import '../css/MakeList.css'
import { connect } from 'react-redux'
import axios from 'axios'
import App from '../App.js'
import Modal from 'react-modal'

class UnconnectedLoginAlert extends Component {
  render() {
    if (this.props.loggedIn) {
      this.props.history.push('/')
      return <div />
    } else {
      return (
        <div className="container-fluid main-container-my-reviews">
          <h3 className="jump" style={{ position: 'relative', top: '50px' }}>
            To access this feature please Sign up or Log in
          </h3>
        </div>
      )
    }
  }
}

let mapStateToProps = function(state) {
  return { loggedIn: state.state.loggedIn }
}

let LoginAlert = connect(mapStateToProps)(withRouter(UnconnectedLoginAlert))
export default LoginAlert
