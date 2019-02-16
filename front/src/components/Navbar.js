import React, { Component } from 'react'
import '../css/style.css'
import { Link } from 'react-router-dom'
// import { connect } from 'react-redux'
import LoginSignup from "./LoginSignup"
class Navbar extends Component {
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

                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    LOGIN
                  </Link>
                </li>

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

export default Navbar
