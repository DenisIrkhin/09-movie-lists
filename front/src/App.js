import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css'

import Logo from './components/Logo'
import Test from './components/Test'
// For future using
import Navbar from './components/Navbar'

class App extends Component {
  // Render Test comp for fetch data from mongo and understand that it works
  renderTest () {
    return (
      <div>
        <Test />
      </div>
    )
  }

  render () {
    return (
      <BrowserRouter>
        <div className='App'>
          <Navbar />
          <Logo />
          <Route exact path='/test' render={this.renderTest} />
        </div>
      </BrowserRouter>
    )
  }
}

export default App
