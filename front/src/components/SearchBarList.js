import React, { Component } from 'react'
import '../css/style.css'
import { Redirect, Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import '../css/MakeList.css'
import { connect } from 'react-redux'
import axios from 'axios'
import App from '../App.js'
import Modal from 'react-modal'

class UnconnectedSearchList extends Component {
  constructor(props) {
    super(props)
    this.state = { inputSearch: '' }
    this.handleInputSearch = this.handleInputSearch.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleInputSearch(evt) {
    this.setState({ inputSearch: evt.currentTarget.value })
  }
  handleSubmit(evt) {
    console.log('submitted searchList form')
    evt.preventDefault()

    this.props.history.push('/searchlistresults/' + this.state.inputSearch)
  }

  render() {
    return (
      //   <li className="nav-item" id="listItem" style={{ display: 'none' }}>
      <form
        className="form-inline form-spacing form-lists-control"
        onSubmit={this.handleSubmit}
      >
        <input
          className="form-control search-select input-lists-control"
          type="search"
          onChange={this.handleInputSearch}
          value={this.state.inputSearch}
          placeholder="Search lists"
          autocomplete="off"
        />
      </form>
      //   </li>
    )
  }
}

// let mapStateToProps=function(state){
//     return {}
// }

let SearchList = connect()(withRouter(UnconnectedSearchList))

export default SearchList
