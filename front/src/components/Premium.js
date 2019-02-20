import React, { Component } from 'react'
import PremiumPayment from './PremiumPayment'
import ProPayment from './ProPayment'

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
          <p className="top-premium-text">Become a pro or a premium member.</p>
        </div>
        <div className="container second-cont-premium">
          <div className="row row-premium-page">
            <div className="col-md-4 text-center premium-holder">
              <h4 className="premium-patron-header">Pro</h4>
              <p>
                No third-party ads.
                <br />
                Unlimited number of lists.
                <br /> More filters when searching for movies.
              </p>
              <p className="price">$35</p>
              <ProPayment />
            </div>
            <div className="col-md-4 text-center patron-holder">
              <h4 className="premium-patron-header">Premium</h4>
              <p>
                Everything in advanced.
                <br />
                More list options.
                <br />
                More options to style your user profile.
              </p>
              <p className="price">$49</p>
              <PremiumPayment />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Premium
