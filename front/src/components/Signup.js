import React, { Component } from 'react'
import '../css/style.css'
import { Redirect } from 'react-router-dom'
// import "../css/LoginSignup.css";
import { connect } from 'react-redux'
import axios from 'axios'
import App from '../App.js'
import Modal from 'react-modal'

Modal.setAppElement(App)

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '50000000000',
    webkitBoxShadow: '0px 1px 4px 1px rgba(201, 201, 201, 0.27)',
    mozBoxShadow: '0px 1px 4px 1px rgba(201, 201, 201, 0.27)',
    boxShadow: '0px 1px 4px 1px rgba(201, 201, 201, 0.27)',
    backgroundColor: '#F7F7F7'
  }
}

class UnconnectedSignup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputEmail: '',
      inputPassword: '',
      inputConfirmPassword: '',
      inputUsername: '',
      modalIsOpen: true,
      modalMessage: ''
    }
    this.handleInputPassword = this.handleInputPassword.bind(this)
    this.handleInputConfirmPassword = this.handleInputConfirmPassword.bind(this)
    this.handleInputEmail = this.handleInputEmail.bind(this)
    this.handleInputUsername = this.handleInputUsername.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.openModal = this.openModal.bind(this)
    this.afterOpenModal = this.afterOpenModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }
  handleInputEmail(evt) {
    this.setState({ inputEmail: evt.currentTarget.value })
  }
  handleInputUsername(evt) {
    this.setState({ inputUsername: evt.currentTarget.value })
  }
  handleInputPassword(evt) {
    this.setState({ inputPassword: evt.currentTarget.value })
  }
  handleInputConfirmPassword(evt) {
    this.setState({ inputConfirmPassword: evt.currentTarget.value })
  }

  handleSubmit(e) {
    // let that = this
    e.preventDefault()
    if (this.state.inputConfirmPassword !== this.state.inputPassword) {
      this.setState({ modalMessage: 'Password fields do not match.' })
      return
    }
    // make fetch request here and dispatch action if it returns positive
    // Recommend that backend also expects a password and user
    let reqBody = {
      email: this.state.inputEmail,
      password: this.state.inputPassword,
      password2: this.state.inputConfirmPassword,
      username: this.state.inputUsername
    }
    console.log('reqBody', reqBody)
    axios({
      method: 'post',
      data: reqBody,
      url: '/api/users/signup',
      withCredentials: true
    })
      .then(response => {
        console.log('post signup was successful')
        console.log('response', response)
        let { email, userId, avatar } = response.data
        // Dispatch to set loggedIn to true
        this.props.dispatch({
          type: 'login',
          payload: { email, userId, avatar }
        })
        axios({
          method: 'get',
          url: 'api/lists',
          withCredentials: true
        }).then(response => {
          console.log('response', response)
          let responseLists = response.data.lists
          console.log('responseLists', responseLists)
          this.props.dispatch({ type: 'getLists', payload: responseLists })
        })
      })
      .catch(e => {
        console.log('error of this request', e.response.data.valErrors)
        try {
          let errorMessage = Object.values(e.response.data.valErrors).join(';')
          console.log('errorMessage', errorMessage)
          this.setState({
            modalMessage: errorMessage
          })
        } catch (error) {
          console.log('error', error)
        }
      })
    //
  }

  openModal() {
    this.setState({ modalIsOpen: true })
  }

  afterOpenModal() {
    // this.subtitle.style.color="#f00"
  }

  closeModal() {
    this.setState({ modalIsOpen: false })
  }

  render() {
    if (!this.props.loggedIn && this.state.modalIsOpen) {
      return (
        <div>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
          >
            <h3 className="header-login-signup mb-3 ml-1">Sign up </h3>
            <form onSubmit={this.handleSubmit}>
              <div className=" ml-2">
                <input
                  type="text"
                  onChange={this.handleInputEmail}
                  value={this.state.inputEmail}
                  className="input-login-signup"
                />
                <div className="mb-1">Email</div>
              </div>
              <div className=" ml-2">
                <input
                  type="text"
                  onChange={this.handleInputUsername}
                  value={this.state.inputUsername}
                  className="input-login-signup"
                  pattern=".{3,15}"
                  required
                  title="2 to 15 characters"
                />
                <div className="mb-1">Username</div>
              </div>
              <div>
                <input
                  type="password"
                  onChange={this.handleInputPassword}
                  value={this.state.inputPassword}
                  className=" ml-2 input-login-signup"
                />
                <div className=" ml-2 mb-2">Password</div>
              </div>
              <div>
                <input
                  type="password"
                  onChange={this.handleInputConfirmPassword}
                  value={this.state.inputConfirmPassword}
                  className=" ml-2 input-login-signup"
                  pattern={this.state.inputPassword}
                  required
                  title="passwords must match"
                />
                <div className=" ml-2 mb-2">Confirm Password</div>
              </div>
              <div className="modal-message">{this.state.modalMessage}</div>
              <input className="btn button-login-signup" type="submit" />
            </form>
          </Modal>
        </div>
      )
    } else {
      return <Redirect to="/" />
    }
  }
}

let mapStateToProps = function(state) {
  return { loggedIn: state.state.loggedIn }
}

let Signup = connect(mapStateToProps)(UnconnectedSignup)

export default Signup

// // add as list item in navbar
// {
//   /* <li className="nav-item nav-link">
//                 <LoginSignup/>
//                 </li> */
// }
