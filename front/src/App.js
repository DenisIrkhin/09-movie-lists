import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css'
import { connect } from 'react-redux'
import Logo from './components/Logo'
import Test from './components/Test'
// import thunk from 'redux-thunk'
// For future using
import Navbar from './components/Navbar'
import Login from './components/Login'
import Signup from './components/Signup'



class UnconnectedApp extends Component {
  constructor(props){
    super(props)
    
  }
  // Render Test comp for fetch data from mongo and understand that it works
  renderTest () {
    return (
      <div>
        <Signup />
      </div>
    )
  }

  render () {
    return (
      <BrowserRouter>
        <div className='App'>
          <Navbar />
          <Logo />
          <Route exact path='/tests' render={this.renderTest} />
        </div>
      </BrowserRouter>
    )
  }
}
let mapStateToProps = function (state) {
  return { ...state }
}

let App = connect(mapStateToProps)(UnconnectedApp)

export default App
