import React, { Component } from 'react'
import '../css/style.css'
import { Redirect, Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { FacebookShareButton, TwitterShareButton } from 'react-share'

import '../css/MakeList.css'
import { connect } from 'react-redux'
import axios from 'axios'
import App from '../App.js'
import Modal from 'react-modal'

class SearchListResults extends Component {
  constructor(props) {
    super(props)
    this.state = { searchQuery: '', results: [] }
    this.startSearch = this.startSearch.bind(this)
    this.displayTags = this.displayTags.bind(this)
  }
  startSearch() {
    let that = this
    console.log('getting item id')
    let path = window.location.pathname
    console.log('path', path)
    let pathArr = path.split('/')
    console.log('pathArr', pathArr)
    let tail = pathArr[pathArr.length - 1]
    console.log('tail', tail)
    // this.setState({ searchQuery: searchQuery });
    let searchQueryArr = tail.split('%20')
    let searchQuery = searchQueryArr.join(' ')

    console.log('searchQueryArr', searchQueryArr)
    console.log('searchQuery', searchQuery)
    console.log('Fetching from endpoint lists/wildSearch')
    axios({
      method: 'post',
      url: '/api/lists/wildsearch',
      data: { search: searchQuery }
    }).then(response => {
      console.log('response', response)
      if (searchQuery !== that.state.searchQuery) {
        that.setState({
          results: response.data.sortedRankedLists,
          searchQuery: searchQuery
        })
      }
    })
  }
  displayTags(tagList) {
    let that = this
    return tagList.split(' ^^ ').map((elem, index) => {
      return (
        <Link to={'/searchtags/' + elem}>
          <span className="wild-tags ml-1 mr-1">
            {elem} <span name={index} className="fas fa-tag" />
          </span>
        </Link>
      )
    })
  }

  displayResults() {
    //results is an array of lists
    console.log('displaying results')
    let resultsToDom = elem => {
      return (
        <li className="list-item">
          <Link to={'/lists/' + elem._id}>
            <div className="title-lists">{elem.name}</div>
          </Link>
          <span className="list-icons">
            <FacebookShareButton
              url={window.location.origin + '/lists/' + elem._id}
              className={'fab fa-facebook ml-1 mr-1 icon-list'}
            />
            <TwitterShareButton
              url={window.location.origin + '/lists/' + elem._id}
              className={'fab fa-twitter-square ml-1 mr-1 icon-list'}
            />
          </span>
          <div>{elem.description}</div>
          <span>Tags: </span>
          <span>{this.displayTags(elem.tags)}</span>
        </li>
      )
    }
    return this.state.results.map(resultsToDom)
  }

  render() {
    window.onhashchange = () => {
      this.startSearch()
    }
    this.startSearch()
    return (
      <div className="container-fluid main-container-wild-search">
        <h3 className="mb-5">These are your search results</h3>
        <div className="container">
          <ol
            onhashchange={window.onhashchange}
            className="wild-results-holder mt-3"
          >
            {this.displayResults()}
          </ol>
        </div>
      </div>
    )
  }
}

export default SearchListResults
