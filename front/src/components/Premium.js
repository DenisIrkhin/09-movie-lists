import React, { Component } from 'react'
import '../css/style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import axios from 'axios'
import $ from 'jquery'

class Premium extends Component {
  render() {
    return (
      <div className="container-fluid premium-main-cont">
        <div className="container first-cont-premium">
          <h1 className="top-premium-header">Show Your Support</h1>
          <p className="top-premium-text">Become a patron or premium member.</p>
        </div>
        <div className="container second-cont-premium">
          <div className="row row-premium-page">
            <div className="col-md-4 text-center premium-holder">
              <h4 className="premium-patron-header">Premium</h4>
              <p>
                No third-party ads.
                <br />
                Unlimited number of lists.
                <br /> More filters when searching for movies.
              </p>
              <button className="button-premium">PAY NOW</button>
            </div>
            <div className="col-md-4 text-center patron-holder">
              <h4 className="premium-patron-header">Patron</h4>
              <p>
                Everything in premium.
                <br />
                Your name on our patron page.
                <br />
                Extra options to style your profile.
              </p>
              <button className="button-premium">PAY NOW</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Premium
