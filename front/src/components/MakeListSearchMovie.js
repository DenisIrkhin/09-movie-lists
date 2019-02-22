import React, { Component } from 'react'
import '../css/style.css'
import { Redirect, Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import '../css/MakeList.css'
import { connect } from 'react-redux'
import axios from 'axios'
import App from '../App.js'
import Modal from 'react-modal'

class MoviesBody extends Component {
  constructor(props) {
    super(props)
    this.state = { inputMovie: '', searchResults: [] }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputMovie = this.handleInputMovie.bind(this)
    this.getMovies = this.getMovies.bind(this)
    this.addMovie = this.addMovie.bind(this)
  }
  getMovies(search) {
    axios(
      'https://api.themoviedb.org/3/search/movie?api_key=98325a9d3ed3ec225e41ccc4d360c817&language=en-US&query=' +
        search
    ).then(response => {
      console.log('response', response)
      this.setState({ searchResults: response.data.results })
    })
  }
  displaySearchResults() {
    console.log('displaying movie search results')
    let elemToDOM = elem => {
      if (elem.poster_path !== null) {
        return (
          <li name="movie" className="row" style={{ marginBottom: '10px' }}>
            <span
              name="addMovie"
              className="addMovie fas fa-plus-circle mt-3"
              onClick={() => {
                this.addMovie(elem)
              }}
            />
            <img
              src={'https://image.tmdb.org/t/p/w500' + elem.poster_path}
              style={{ maxWidth: '30px', maxHeight: '50px' }}
              className="mr-2"
            />
            <span className="search-text-make-list">
              <div>{elem.original_title}</div>
              <div style={{ fontSize: '.5em' }}>{elem.release_date}</div>
            </span>
          </li>
        )
      }
    }

    let mappedResults = this.state.searchResults.map(elemToDOM)
    return mappedResults
  }
  handleInputMovie(evt) {
    this.setState({ inputMovie: evt.target.value })
  }
  handleSubmit(evt) {
    evt.preventDefault()
    let search = this.state.inputMovie
    console.log('search', search)
    this.getMovies(search)
  }

  addMovie(movie) {
    console.log('added movie to list')
    console.log('movie', movie)
    console.log('movie added', movie.original_title)
    let newMovieArr = this.props.parent.state.chosenMovies.concat(movie)
    this.props.parent.setState({ chosenMovies: newMovieArr })
  }
  render() {
    let searchResultsStyle
    console.log('rendering moviesbody')

    if (this.state.searchResults.length === 0) {
      searchResultsStyle = {
        maxWidth: '500px',
        maxHeight: '300px',
        margin: '20px',
        overflow: 'auto',
        overflowX: 'hidden'
      }
    } else {
      searchResultsStyle = {
        maxWidth: '500px',
        maxHeight: '280px',
        border: '1px solid rgb(192, 192, 192)',
        margin: '20px',
        overflow: 'auto',
        overflowX: 'hidden'
      }
    }
    return (
      <div style={searchResultsStyle} className="">
        <form onSubmit={this.handleSubmit}>
          <input
            type="search"
            placeholder=" Search Movies"
            onChange={this.handleInputMovie}
            value={this.state.inputMovie}
            className="form-input-search-add"
          />
        </form>
        <ol name="searchResults">{this.displaySearchResults()}</ol>
      </div>
    )
  }
}

export default MoviesBody
