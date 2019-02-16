import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css'
import {connect} from 'react-redux'
import Test from './components/Test'
// import thunk from 'redux-thunk'
// For future using
import Navbar from './components/Navbar'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'




class UnconnectedApp extends Component {
  constructor(props){
    super(props)
    
  }
  // Render Test comp for fetch data from mongo and understand that it works
  renderTest() {
    console.log("test page rendered")
    return (
      <div>
        <Signup />
      </div>
    )
  }
  renderSignup(){
    console.log("signup component rendered")
    return(
      <Signup></Signup>
    )
  }
  renderLogin(){
    console.log("login component rendered")
    return (
      <Login></Login>
    )
  }

  render() {
  
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Home />
          <Route exact path="/signup" render={this.renderSignup}/>
          <Route exact path="/login" render={this.renderLogin}/>
          <Route exact path="/test" render={this.renderTest} />
        </div>
      </BrowserRouter>
    )
  }
}
let mapStateToProps = function (state) {
  return { ...state}
}

let App = connect(mapStateToProps)(UnconnectedApp)

export default App
