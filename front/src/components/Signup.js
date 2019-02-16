import React, { Component } from "react";
import "../css/style.css";
import { Link } from "react-router-dom";
import "../css/LoginSignup.css";
import {connect} from "react-redux"
import axios from 'axios'


class UnconnectedSignup extends Component {
  constructor(props) {
    super(props);
    this.state={inputEmail:"",inputPassword:""}
    this.handleInputPassword=this.handleInputPassword.bind(this)
    this.handleInputEmail=this.handleInputEmail.bind(this)
    this.handleSubmit=this.handleSubmit.bind(this)
  }
  handleInputEmail(evt){
    this.setState({inputEmail:evt.currentTarget.value})
  }
  handleInputPassword(evt){
    this.setState({inputPassword:evt.currentTarget.value})
  }

  handleSubmit(e){
    e.preventDefault()
    //make fetch request here and dispatch action if it returns positive
    //Recommend that backend also expects a password and user
    axios({
      method: "post",
      data: { email: this.state.inputEmail },
      url: "http://localhost:5050/users/Signup",
      withCredentials: true
    }).then(function(response){
      console.log(response)
    })
    //
    this.props.dispatch({type:"login"})
  }

  render() {
    return (
      <div className="bg-danger flyoutField center row  T-ALeft">
      <form onSubmit={this.handleSubmit}>
        <div className=" bg-dange field">
          <input type="text"  onChange={this.handleInputEmail} value={this.state.inputEmail}/>
          <div className="tSmall">Email</div>
        </div>
        <div className="field ">
          <input type="text" onChange={this.handleInputPassword} value={this.state.inputPassword}/>
          <div className="tSmall">Password</div>
        </div>
        <input type="submit"/>
        </form>
      </div>
    );
  }
}

let mapStateToProps=function(state){
  return {loggedIn:state.loggedIn}
}

let Signup=connect(mapStateToProps)(UnconnectedSignup)

export default Signup;

//add as list item in navbar
{/* <li className="nav-item nav-link">
                <LoginSignup/>
                </li> */}