import React, { Component } from 'react'
import '../css/style.css'
import { Link } from 'react-router-dom'
// import { connect } from 'react-redux'

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-main-style">
        <div className="container">
          <Link to="/" className="navbar-brand">
            Movie Lists
          </Link>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/signup" className="nav-link">
                  CREATE ACCOUNT
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  LOGIN
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/lists" className="nav-link">
                  LISTS
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/reviews" className="nav-link">
                  REVIEWS
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/reviews" className="nav-link">
                  CHAT
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar
