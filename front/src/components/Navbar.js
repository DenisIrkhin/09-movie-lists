import React, { Component } from 'react'
import '../css/style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import axios from 'axios'
import $ from 'jquery'

class UnconnectedNavbar extends Component {
  CheckIfLoggedIn() {
    if (!this.props.loggedIn) {
      return (
        <React.Fragment>
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
        </React.Fragment>
      )
    } else {
      console.log('logout rendered')
      return (
        <li className="nav-item">
          <Link
            to="/"
            className="nav-link"
            onClick={() => {
              console.log('onClick event')
              this.props.dispatch({ type: 'logout' })
            }}
          >
            LOG OUT (Logged in as {this.props.user})
          </Link>
        </li>
      )
    }
  }
  componentDidMount() {
    document.getElementById('searchForm').addEventListener('submit', event => {
      event.preventDefault()
      let searchText = document.getElementById('searchText').value
      console.log(searchText)
      this.getMovies(searchText)
    })
  }

  // getMovie(idArray) {
  //   let imdbId = []
  //   for (let i = 0; i < idArray.length; i++) {
  //     axios
  //       .get(
  //         'https://api.themoviedb.org/3/movie/' +
  //           idArray[i] +
  //           '?api_key=98325a9d3ed3ec225e41ccc4d360c817'
  //       )
  //       .then(function(response) {
  //         imdbId.push({ imdbid: response.data.imdb_id })
  //         return imdbId
  //       })
  //   }
  //   console.log('return statement')
  //   // return imdbId
  // }

  getMovies(searchText) {
    if (searchText === '') {
      this.props.history.push('/')
    } else {
      this.props.history.push('/search')
      axios
        .get(
          'https://api.themoviedb.org/3/search/movie?api_key=98325a9d3ed3ec225e41ccc4d360c817&language=en-US&query=' +
            searchText
        )
        .then(response => {
          let movies = response.data.results
          // let arrayId = []
          // for (let i = 0; i < movies.length; i++) {
          //   // console.log('test', movies[i].id)
          //   arrayId.push(movies[i].id)
          // }
          // let imdbId = this.getMovie(arrayId)
          // console.log('imdbId', imdbId[0])

          let output = ''
          console.log('after', movies)
          for (let movie of movies) {
            if (movie.poster_path !== null) {
              console.log(movie)
              output += `<div class="col-md-8 movie-holder">

            <div class="well img-holder-search">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
              <button class="add-list-button" id="buttonMovie-large">ADD TO LIST</button>
            </div>

            <div class="text-holder-search">
              <h5 class="title-search-result">${movie.title}</h5>
              <p class="text-search-result">${movie.overview}</p>
              <p class="release-search-result"><strong>Release date:</strong> ${
                movie.release_date
              }</p>
              <p class="rating-search-result"><strong>Rating:</strong> ${
                movie.vote_average
              }/10</p>
              <button class="add-list-button" id="buttonMovie-small">ADD TO LIST</button>
            </div>

          </div>`
            }
          }
          $('#movies').html(output)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  render() {
    return (
      <nav
        className="navbar navbar-expand-lg navbar-dark"
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
                <form className="form-inline form-spacing" id="searchForm">
                  <input
                    className="form-control search-select"
                    type="text"
                    id="searchText"
                    placeholder="Search for movies"
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
                <Link to="/lists" className="nav-link">
                  MY LISTS
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/lists/makelist" className="nav-link">
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
    )
  }
}

let mapStateToProps = function(state) {
  return { loggedIn: state.state.loggedIn, user: state.state.user }
}
let Navbar = connect(mapStateToProps)(withRouter(UnconnectedNavbar))
export default Navbar
