import React, { Component } from 'react'
import '../css/style.css'
import { Redirect } from 'react-router-dom'
import '../css/LoginSignup.css'
import { connect } from 'react-redux'
import axios from 'axios'
import App from '../App.js'
import Modal from 'react-modal'
// import { BACKEND_DOMAIN } from '../Global'

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

class UnconnectedLogin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      inputEmail: '',
      inputPassword: '',
      modalIsOpen: true,
      modalMessage: ''
    }
    this.handleInputPassword = this.handleInputPassword.bind(this)
    this.handleInputEmail = this.handleInputEmail.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.openModal = this.openModal.bind(this)
    this.afterOpenModal = this.afterOpenModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  handleInputEmail (evt) {
    this.setState({ inputEmail: evt.currentTarget.value })
  }
  handleInputPassword (evt) {
    this.setState({ inputPassword: evt.currentTarget.value })
  }

  handleSubmit (e) {
    // let that = this
    e.preventDefault()
    let reqBody = {
      email: this.state.inputEmail,
      password: this.state.inputPassword
    }
    console.log('reqBody', reqBody)
    // make fetch request here and dispatch action if it returns positive
    axios({
      method: 'post',
      data: reqBody,
      url: 'api/users/login',
      withCredentials: true
    })
      .then(response => {
        console.log('res message', response.data.message)
        console.log('response', response)
        console.log('cookie', document.cookie)
        if (response.data.success === true) {
          let { email, userId, avatar } = response.data
          // Dispatch to set loggedIn to true
          this.props.dispatch({ type: 'login', payload: { email, userId, avatar } })
          // add the list to the store for the particular user"
          console.log('fetch from endpoint /lists')
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
        } else {
          this.setState({
            modalMessage: 'Wrong username or password.'
          })
        }
      })
      .catch(e => {
        if (e) {
          console.log('error', e.response.data.valErrors)
          this.setState({
            modalMessage: Object.values(e.response.data.valErrors).join(';')
          })
          // console.log("Error. probably username doesnt exist")
        }
      })
  }

  openModal () {
    this.setState({ modalIsOpen: true })
  }

  afterOpenModal () {
    // this.subtitle.style.color="#f00"
  }

  closeModal () {
    this.setState({ modalIsOpen: false })
  }
  render () {
    if (!this.props.loggedIn && this.state.modalIsOpen) {
      return (
        <div>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
          >
            <h3 className='header-login-signup mb-3 ml-1'>Log in </h3>
            <form onSubmit={this.handleSubmit}>
              <div className=' ml-2'>
                <input
                  type='text'
                  onChange={this.handleInputEmail}
                  value={this.state.inputEmail}
                  className='input-login-signup'
                />
                <div className='mb-1'>Email</div>
              </div>
              <div>
                <input
                  type='text'
                  onChange={this.handleInputPassword}
                  value={this.state.inputPassword}
                  className=' ml-2 input-login-signup'
                />
                <div className=' ml-2 mb-2'>Password</div>
              </div>
              <div className='modal-message'>{this.state.modalMessage}</div>
              <input className='btn button-login-signup' type='submit' />
            </form>
          </Modal>
        </div>

      // this component works. now im trying to make it into a separate component
      // <div >

      //   <Modal isOpen={this.state.modalIsOpen} onAfterOpen={this.afterOpenModal} onRequestClose={this.closeModal} style={customStyles}>
      //   <h3>Log in </h3>
      //   <form onSubmit={this.handleSubmit}>
      //     <div>
      //       <input
      //         type="text"
      //         onChange={this.handleInputEmail}
      //         value={this.state.inputEmail}
      //       />
      //       <div>Email</div>
      //     </div>
      //     <div>
      //       <input
      //         type="text"
      //         onChange={this.handleInputPassword}
      //         value={this.state.inputPassword}
      //       />
      //       <div>Password</div>
      //     </div>
      //     <input type="submit" />
      //   </form>
      //   </Modal>
      // </div>
      )
    } else {
      return <Redirect to='/' />
    }
  }
}

// class UnconnectedLogin extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { inputEmail: "", inputPassword: "" ,modalIsOpen:false};
//     this.handleInputPassword = this.handleInputPassword.bind(this);
//     this.handleInputEmail = this.handleInputEmail.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }

//   openModal(){
//     this.setState({modalIsOpen:true})
//   }

//   afterOpenModal(){
//     this.subtitle.style.color="#f00"
//   }

//   closeModal(){
//     this.setState({modalIsOpen:false})
//   }

//   handleInputEmail(evt) {
//     this.setState({ inputEmail: evt.currentTarget.value });
//   }
//   handleInputPassword(evt) {
//     this.setState({ inputPassword: evt.currentTarget.value });
//   }

//   handleSubmit(e) {
//     e.preventDefault();
//     //make fetch request here and dispatch action if it returns positive
//     axios({
//       method: "post",
//       data: { email: this.state.inputEmail },
//       url: "http://localhost:5050/users/login",
//       withCredentials: true
//     }).then(function(response) {

//         console.log("res message", response.data.message);
//         console.log("response", response);
//         console.log("cookie", document.cookie);

//         this.props.dispatch({ type: "login" });

//     }).catch(function(e){if(e.response.status===404){
//       console.log("Error. probably username doesnt exist")
//     }})

//   }

//   render() {
//     return (
//       <div className="bg-danger flyoutField center row  T-ALeft">
//         <form onSubmit={this.handleSubmit}>
//           <div className=" bg-dange field">
//             <input
//               type="text"
//               onChange={this.handleInputEmail}
//               value={this.state.inputEmail}
//             />
//             <div className="tSmall">Email</div>
//           </div>
//           <div className="field ">
//             <input
//               type="text"
//               onChange={this.handleInputPassword}
//               value={this.state.inputPassword}
//             />
//             <div className="tSmall">Password</div>
//           </div>
//           <input type="submit" />
//         </form>
//       </div>
//     );
//   }
// }

let mapStateToProps = function (state) {
  return { loggedIn: state.state.loggedIn }
}

let Login = connect(mapStateToProps)(UnconnectedLogin)

export default Login

// add as list item in navbar
{
  /* <li className="nav-item nav-link">
                <LoginSignup/>
                </li> */
}
