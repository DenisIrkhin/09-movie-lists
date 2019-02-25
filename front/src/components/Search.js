import React, { Component } from 'react'
import axios from 'axios'
import { BrowserRouter, Route } from 'react-router-dom'
import { withRouter } from 'react-router'
import $ from 'jquery'
import FilterDropdown from './FilterDropdown'

class Search extends Component {
  constructor() {
    super()
    this.state = { addingToList: false }
    this.renderFilterDropdown = this.renderFilterDropdown.bind(this)
  }

  componentDidMount() {
    {
      this.checkLocalStorage()
    }
    let that = this
    let moviesCheck = document.getElementById('movies')
    moviesCheck.addEventListener('click', ({ target }) => {
      if (target.matches('#see-more-large')) {
        let id = target.value
        this.props.history.push('/movie/' + id)
        axios
          .get(
            'https://api.themoviedb.org/3/movie/' +
              id +
              '?api_key=98325a9d3ed3ec225e41ccc4d360c817'
          )
          .then(function(response) {
            console.log('works?', response.data)
            let movie = response.data
            let output = `
            <div class="row">
              <div class="col-md-4">
                <img src="https://image.tmdb.org/t/p/w500${
                  movie.poster_path
                }" class="thumbnail">
              </div>
              <div class="col-md-8">
                <h2>${movie.title}</h2>
                <ul class="list-group">
                  <li class="list-group-item"><strong>Genre:</strong> ${
                    movie.genres[0].name
                  }, ${movie.genres[1].name}</li>
                  <li class="list-group-item"><strong>Released:</strong> ${
                    movie.release_date
                  }</li>
                  <li class="list-group-item"><strong>Rated:</strong> ${
                    movie.vote_average
                  }</li>
                  <li class="list-group-item"><strong>Runtime:</strong> ${
                    movie.runtime
                  } min.</li>
                  <li class="list-group-item"><strong>Production Companies:</strong> ${
                    movie.production_companies[0].name
                  } min.</li>
                </ul>
              </div>
            </div>
            <div class="row">
              <div class="well">
                <h3>Plot</h3>
                ${movie.overview}
                <hr>
                <a href="http://imdb.com/title/${
                  movie.imdb_id
                }" target="_blank" class="btn btn-primary">View IMDB</a>
                <a href="index.html" class="btn btn-default">Go Back To Search</a>
              </div>
            </div>
            `
            $('#movieDetails').html(output)
            return
          })
          .catch(err => {
            console.log(err)
          })
      }
      if (target.matches('#see-more-small')) {
        let id = target.value
        console.log(id)
        this.props.history.push('/movie')
        axios
          .get(
            'https://api.themoviedb.org/3/movie/' +
              id +
              '?api_key=98325a9d3ed3ec225e41ccc4d360c817'
          )
          .then(function(response) {
            console.log('works?', response.data)
            let movie = response.data
            let output = `
            <div class="row">
              <div class="col-md-4">
                <img src="https://image.tmdb.org/t/p/w500${
                  movie.poster_path
                }" class="thumbnail">
              </div>
              <div class="col-md-8">
                <h2>${movie.title}</h2>
                <ul class="list-group">
                  <li class="list-group-item"><strong>Genre:</strong> ${
                    movie.genres[0].name
                  }, ${movie.genres[1].name}</li>
                  <li class="list-group-item"><strong>Released:</strong> ${
                    movie.release_date
                  }</li>
                  <li class="list-group-item"><strong>Rated:</strong> ${
                    movie.vote_average
                  }</li>
                  <li class="list-group-item"><strong>Runtime:</strong> ${
                    movie.runtime
                  } min.</li>
                  <li class="list-group-item"><strong>Production Companies:</strong> ${
                    movie.production_companies[0].name
                  } min.</li>
                </ul>
              </div>
            </div>
            <div class="row">
              <div class="well">
                <h3>Plot</h3>
                ${movie.overview}
                <hr>
                <a href="http://imdb.com/title/${
                  movie.imdb_id
                }" target="_blank" class="btn btn-primary">View IMDB</a>
                <a href="index.html" class="btn btn-default">Go Back To Search</a>
              </div>
            </div>
            `
            $('#movieDetails').html(output)
            return
          })
          .catch(err => {
            console.log(err)
          })
      }
      if (target.matches('#addMovieToLists')) {
        let id = target.value
        console.log('target', target)
        console.log('fetch to get specific movie object based on')
        axios
          .get(
            'https://api.themoviedb.org/3/movie/' +
              id +
              '?api_key=98325a9d3ed3ec225e41ccc4d360c817'
          )
          .then(response => {
            console.log('response', response)
            let movie = response.data
            console.log('movie', movie)
            that.setState({ movie: movie, addingToList: true })
          })
      }
    })
  }
  renderFilterDropdown() {
    if (this.state.addingToList) {
      return (
        <FilterDropdown
          movie={this.state.movie}
          xPos={this.state.xPos}
          yPos={this.state.yPos}
          parent={this}
        />
      )
    }
  }

  //Returns the last saved local storage result and returns as ouput
  //Works with back button and refresh
  checkLocalStorage = () => {
    let output = $($.parseHTML(localStorage.getItem('movies')))
    $('#movies').html(output)
  }

  render() {
    return (
      <div
        className="container-fluid main-container-search"
        onMouseMove={e => {
          // console.log("event triggered")
          // console.log('e.clientX', e.clientX)
          // console.log('e.clientY', e.clientY)
          // console.log('window.scrollX', window.scrollX)
          // console.log('window.scrollY', window.scrollY)

          this.setState({ xPos: e.clientX, yPos: e.clientY })
        }}
      >
        <div id="movies" className="row pt-5" />
        {this.renderFilterDropdown()}
      </div>
    )
  }
}

export default withRouter(Search)
