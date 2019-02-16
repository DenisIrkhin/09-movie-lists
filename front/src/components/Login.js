import React, { Component } from "react";
import "../css/style.css";
import { Link } from "react-router-dom";
import "../css/LoginSignup.css";
import { connect } from "react-redux";
import axios from "axios";

class UnconnectedLogin extends Component {
  constructor(props) {
    super(props);
    this.state = { inputEmail: "", inputPassword: "" };
    this.handleInputPassword = this.handleInputPassword.bind(this);
    this.handleInputEmail = this.handleInputEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleInputEmail(evt) {
    this.setState({ inputEmail: evt.currentTarget.value });
  }
  handleInputPassword(evt) {
    this.setState({ inputPassword: evt.currentTarget.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    //make fetch request here and dispatch action if it returns positive
    axios({
      method: "post",
      data: { email: this.state.inputEmail },
      url: "http://localhost:5050/users/login",
      withCredentials: true
    }).then(function(response) {
      
        console.log("res message", response.data.message);
        console.log("response", response);
        console.log("cookie", document.cookie);

        this.props.dispatch({ type: "login" });
      
    }).catch(function(e){if(e.response.status===404){
      console.log("Error. probably username doesnt exist")
    }})

    //testing with fetch because i cant get cookie
    // fetch("http://localhost:5050/users/login", {
    //   method: "Post",
    //   body: { email: this.state.inputEmail }

    // }).then(response=>{return response})
    // .then(function(response) {
    //   let parsedResponse=response
    //   console.log("response", parsedResponse);
    //   console.log("res message", parsedResponse.body.message);
    //   console.log("cookie", parsedResponse.headers);
    // });
    //
    // this.props.dispatch({ type: "login" });
  }

  render() {
    return (
      <div className="bg-danger flyoutField center row  T-ALeft">
        <form onSubmit={this.handleSubmit}>
          <div className=" bg-dange field">
            <input
              type="text"
              onChange={this.handleInputEmail}
              value={this.state.inputEmail}
            />
            <div className="tSmall">Email</div>
          </div>
          <div className="field ">
            <input
              type="text"
              onChange={this.handleInputPassword}
              value={this.state.inputPassword}
            />
            <div className="tSmall">Password</div>
          </div>
          <input type="submit" />
        </form>
      </div>
    );
  }
}

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
