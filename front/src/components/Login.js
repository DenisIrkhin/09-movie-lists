import React, { Component } from "react";
import "../css/style.css";
import {Redirect,Link } from "react-router-dom";
import "../css/LoginSignup.css";
import { connect } from "react-redux";
import axios from "axios";
import App from "../App.js"
import Modal from "react-modal"

Modal.setAppElement(App)

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class UnconnectedLogin extends Component {
  constructor(props) {
    super(props);
    this.state = { inputEmail: "", inputPassword: "" ,modalIsOpen:true,modalMessage:""};
    this.handleInputPassword = this.handleInputPassword.bind(this);
    this.handleInputEmail = this.handleInputEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openModal=this.openModal.bind(this)
    this.afterOpenModal=this.afterOpenModal.bind(this)
    this.closeModal=this.closeModal.bind(this)
  }

  handleInputEmail(evt) {
    this.setState({ inputEmail: evt.currentTarget.value });
  }
  handleInputPassword(evt) {
    this.setState({ inputPassword: evt.currentTarget.value });
  }

  handleSubmit(e) {
    let that=this
    e.preventDefault();
    //make fetch request here and dispatch action if it returns positive
    axios({
      method: "post",
      data: { email: this.state.inputEmail },
      url: "http://localhost:5050/users/login",
      withCredentials: true
    }).then((response)=> {
      
        console.log("res message", response.data.message);
        console.log("response", response);
        console.log("cookie", document.cookie);

        this.props.dispatch({ type: "login" });
      
    }).catch((e)=>{if(e){
      this.setState({modalMessage:"Wrong username or password. Please try again"})
      // console.log("Error. probably username doesnt exist")
    }})

    
   
  }

  openModal(){
    this.setState({modalIsOpen:true})
  }

  afterOpenModal(){
    // this.subtitle.style.color="#f00"
  }

  closeModal(){
    this.setState({modalIsOpen:false})
    
  }
  render() {
    if(!this.props.loggedIn && this.state.modalIsOpen){

    
    return (
      <div >

        <Modal isOpen={this.state.modalIsOpen} onAfterOpen={this.afterOpenModal} onRequestClose={this.closeModal} style={customStyles}>
        <h3>Log in </h3>
        <form onSubmit={this.handleSubmit}>
          <div>
            <input
              type="text"
              onChange={this.handleInputEmail}
              value={this.state.inputEmail}
            />
            <div>Email</div>
          </div>
          <div>
            <input
              type="text"
              onChange={this.handleInputPassword}
              value={this.state.inputPassword}
            />
            <div>Password</div>
          </div>
          <div style={{color:"red"}}>{this.state.modalMessage}</div>
          <input type="submit" />
        </form>
        </Modal>
      </div>

      //this component works. now im trying to make it into a separate component
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
    );
  }else{
    return <Redirect to="/"></Redirect>
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

let mapStateToProps = function(state) {
  return { loggedIn: state.loggedIn };
};

let Login = connect(mapStateToProps)(UnconnectedLogin);

export default Login;

//add as list item in navbar
{
  /* <li className="nav-item nav-link">
                <LoginSignup/>
                </li> */
}
