import React, { Component } from 'react'
import '../css/style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import axios from 'axios'
import $ from 'jquery'
import SearchList from './SearchBarList'
import Movielogo from '../media/images/movieslists_logo.svg'

class UnconnectedNavbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      moviesSearch: ''
    }
  }
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
        <React.Fragment>
          <li className="nav-item">
            <Link
              to="/profile"
              className="nav-link"
              // onClick={() => {
              //   console.log('onClick event')
              //   this.props.dispatch({ type: 'logout' })
              // }}
            >
              <i className="fas fa-user" />
              <span className="account-text"> MY ACCOUNT</span>
            </Link>
          </li>
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
        </React.Fragment>
      )
    }
  }

  // showMoviesSearch = () => {
  //   console.log('movies')
  //   if (document.getElementById('movieItem').style.display == 'none') {
  //     console.log('movies hidden true')
  //     document.getElementById('movieItem').style.display = 'block'
  //     document.getElementById('listItem').style.display = 'none'
  //   }
  // }

  // showListsSearch = () => {
  //   console.log('lists')
  //   if (document.getElementById('listItem').style.display == 'none') {
  //     console.log('search hidden true')
  //     document.getElementById('listItem').style.display = 'block'
  //     document.getElementById('movieItem').style.display = 'none'
  //   }
  // }

  componentDidMount() {
    document.getElementById('searchForm').addEventListener('submit', event => {
      event.preventDefault()
      let searchText = document.getElementById('searchText').value
      console.log(searchText)
      this.getMovies(searchText)
    })
    document
      .getElementById('searchFormTwo')
      .addEventListener('submit', event => {
        event.preventDefault()
        let searchText = document.getElementById('searchTextTwo').value
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
              <div class="btn-group-vertical" role="group">
              <button type="button" class="add-list-button-left buttonMovie-large" id="addMovieToLists" value="${
                movie.id
              }" >ADD TO LIST</button>
              <button type="button" class="add-list-button-right buttonMovie-large" id="see-more-large" value="${
                movie.id
              }">SEE MORE INFO</button>
              </div>
            </div>

            <div class="text-holder-search">
              <h5 class="title-search-result">${movie.title}</h5>
              <p class="text-search-result">${movie.overview}</p>
              <div class="btn-group" role="group">
              <button type="button" class="add-list-button-left buttonMovie-small" id="addMovieToLists" value="${
                movie.id
              }" >ADD TO LIST</button>
              <button type="button" class="add-list-button-right buttonMovie-small" id="see-more-small" value="${
                movie.id
              }">SEE MORE INFO</button>
              </div>
            </div>

          </div>`
            }
          }
          this.setState({ moviesSearch: output })
          // Pushes the html content to the local storage to access from the search as history
          localStorage.setItem('movies', this.state.moviesSearch)
          $('#movies').html(output)
          console.log('STATE', this.state.moviesSearch)
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
        <Link to="/" className="navbar-brand">
          <img src={Movielogo} className="logo-navbar" />
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
          <ul className="navbar-nav ml-auto justify-content-end">
            <li className="nav-item dropdown desktop-only">
              <a
                className="nav-link dropdown-toggle"
                id="navbarDropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                SEARCH
              </a>
              <div
                className="dropdown-menu dropdown-primary"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <form
                  className="form-inline form-spacing form-lists-control"
                  id="searchForm"
                >
                  <input
                    className="form-control search-select input-lists-control"
                    type="search"
                    id="searchText"
                    placeholder="Search movies"
                    aria-label="Search"
                    autocomplete="off"
                  />
                </form>

                <SearchList />
              </div>
            </li>

            {/* <button
                className="btn dropdown-toggle dropdown-list-choices"
                data-toggle="dropdown"
              >
                <span className="caret" />
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a href="#" onClick={this.showMoviesSearch}>
                    Movies
                  </a>
                </li>
                <li>
                  <a href="#" onClick={this.showListsSearch}>
                    Lists
                  </a>
                </li>
              </ul> */}

            <li className="nav-item mobile-only">
              <form
                className="form-inline form-spacing form-lists-control"
                id="searchFormTwo"
              >
                <input
                  className="form-control search-select input-lists-control"
                  type="search"
                  id="searchTextTwo"
                  placeholder="Search movies"
                  aria-label="Search"
                  autocomplete="off"
                />
              </form>
            </li>
            <li className="nav-item mobile-only">
              <SearchList />
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
              <Link to="/reviews" className="nav-link">
                MY REVIEWS
              </Link>
            </li>
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
      </nav>
    )
  }
}

let mapStateToProps = function(state) {
  return {
    loggedIn: state.state.loggedIn,
    user: state.state.user,
    avatar: state.state.avatar
  }
}
let Navbar = connect(mapStateToProps)(withRouter(UnconnectedNavbar))
export default Navbar
