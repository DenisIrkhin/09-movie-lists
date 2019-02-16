import React, { Component } from 'react'
import '../css/style.css'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
// import { connect } from 'react-redux'

class UnconnectedNavbar extends Component {

  CheckIfLoggedIn(){
    if(!this.props.loggedIn){
    return (
      <div>
      <li className="nav-item">
                  <Link to="/signup" className="nav-link">
                  SIGN UP
                  </Link>

                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    LOG IN
                  </Link>
                </li>
                </div>
    )
    }else{
      console.log("logout rendered")
      return(
        <li className="nav-item">
          <Link to="/" className="nav-link" onClick={console.log("onClick event")}>
          LOG OUT (Logged in as //I need endpoint to get username of current session)
          </Link>
        </li>
      )
    }
  }

  render() {
    
    return (
      <div>
        <nav
          className="navbar navbar-expand-lg sticky-top navbar-dark"
          id="navbar-main-style"
        >
          <Link to="/" className="navbar-brand ml-3">
            Movielists
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="container">
              <ul className="navbar-nav ml-auto justify-content-end">
                <li className="nav-item">
                  <form className="form-inline form-spacing">
                    <input
                      className="form-control search-select"
                      type="text"
                      placeholder="Find Movies"
                      aria-label="Search"
                    />
                  </form>
                </li>
                {this.CheckIfLoggedIn()}

                {/* <li className="nav-item">
                  <Link to="/signup" className="nav-link">
                  SIGN UP
                  </Link>

                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    LOG IN
                  </Link>
                </li> */}

                <li className="nav-item">
                  <Link to="/list" className="nav-link">
                    MAKE LIST
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/premium" className="nav-link">
                    PREMIUM
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

let mapStateToProps=function(state){
  return {loggedIn:state.state.loggedIn}
}

let Navbar=connect(mapStateToProps)(UnconnectedNavbar)

export default Navbar
