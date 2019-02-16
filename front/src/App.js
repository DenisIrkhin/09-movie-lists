import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css'
<<<<<<< Updated upstream
import { connect } from 'react-redux'
import Logo from './components/Logo'
=======

>>>>>>> Stashed changes
import Test from './components/Test'
// import thunk from 'redux-thunk'
// For future using
import Navbar from './components/Navbar'
<<<<<<< Updated upstream
import Login from './components/Login'
import Signup from './components/Signup'


=======
import Home from './components/Home'
>>>>>>> Stashed changes

class UnconnectedApp extends Component {
  constructor(props){
    super(props)
    
  }
  // Render Test comp for fetch data from mongo and understand that it works
  renderTest() {
    return (
      <div>
        <Login />
      </div>
    )
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
<<<<<<< Updated upstream
          <Logo />
          <Route exact path='/tests' render={this.renderTest} />
=======
          <Home />
          <Route exact path="/test" render={this.renderTest} />
>>>>>>> Stashed changes
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
