import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css'
import { connect } from 'react-redux'
// import Test from './components/Test'
import axios from 'axios'
// import thunk from 'redux-thunk'
// For future using
import Navbar from './components/Navbar'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import MakeList from './components/MakeList'
import Lists from './components/Lists'
import List from './components/List'
import searchListResults from './components/SearchListResults'
import FilterDropdown from './components/FilterDropdown'
import Search from './components/Search'
import Movie from './components/Movie'
import LoginAlert from './components/LoginAlert'
import Premium from './components/Premium'
import TagSearchResults from './components/TagSearchResults'
import MyReviews from './components/MyReviews'
import Profile from './components/Profile'

import { BACKEND_DOMAIN } from './Global'
import SearchListResults from './components/SearchListResults'
import EditList from './components/EditList'

// GLOBAL VARIABLES

class UnconnectedApp extends Component {
  constructor (props) {
    super(props)
    this.state = { verified: false }
  }
  componentWillMount () {
    let that = this
    console.log('fetching to endpoint /user/check')
    axios({
      method: 'post',
      url: '/api/users/check',
      withCredentials: true
    })
      .then(response => {
        console.log('response', response)
        let email = response.data.email
        console.log('user', email)
        let userId = response.data.userId
        console.log('userId', userId)
        let avatar = response.data.avatar
        console.log('userId', userId)
        this.props.dispatch({
          type: 'login',
          payload: { email: email, userId: userId, avatar }
        })
      })
      .then(() => {
        axios({
          method: 'get',
          url: '/api/lists',
          withCredentials: true
        }).then(response => {
          console.log('response', response)
          let responseLists = response.data.lists
          console.log('responseLists', responseLists)

          this.props.dispatch({ type: 'getLists', payload: responseLists })
          that.setState({ verified: true })
          console.log('checked successfully')
        })
      })
      .catch(() => {
        that.setState({ verified: true })
      })
  }

  renderHome () {
    console.log('Home page rendered')
    return <Home />
  }

  renderSearch () {
    console.log('Search page rendered')
    return <Search />
  }

  renderMovie (routerData) {
    let movieId = routerData.match.params.id
    console.log('Movie details page rendered')
    return <Movie movieId={movieId} />
  }

  // Render Test comp for fetch data from mongo and understand that it works
  renderTest () {
    console.log('test page rendered')
    return (
      <div>
        <MyReviews />
      </div>
    )
  }
  renderSignup () {
    console.log('signup component rendered')
    return <Signup />
  }
  renderLogin () {
    console.log('login component rendered')
    return <Login />
  }
  renderLoginAlert () {
    console.log('login alert rendered')
    return <LoginAlert />
  }
  renderMakeList () {
    console.log('makelist component rendered')
    return <MakeList />
  }
  renderEditList () {
    console.log('editlist component rendered')
    return <EditList />
  }
  renderLists (routerData) {
    console.log('lists component rendered')
    return <Lists />
  }
  renderList (routerData) {
    if (
      routerData.match.params.id === 'makelist' ||
      routerData.match.params.id === 'editlist'
    ) {
      return <div />
    }
    console.log('specific list component rendered')
    console.log('path of list', routerData.match.params.id)
    return <List listId={routerData.match.params.id} />
  }
  renderSearchListResults (routerData) {
    console.log('search list results route rendered')
    console.log('path of page', routerData.match.params.id)
    return <SearchListResults />
  }

  renderPremium () {
    console.log('premium component rendered')
    return <Premium />
  }
  renderSearchTags (routerData) {
    console.log('searchTags component rendered')
    let tag = routerData.match.params.id
    console.log('tag', tag)
    return <TagSearchResults tag={tag} />
  }
  renderMyReviews () {
    console.log('routing to My reviews page')
    return <MyReviews />
  }

  closePopup (event) {
    event.stopPropagation()
    this.props.dispatch()
  }

  render () {
    if (this.state.verified) {
      return (
        <BrowserRouter>
          <div className='App'>
            <Navbar />
            <Route exact path='/signup' render={this.renderSignup} />
            <Route exact path='/login' render={this.renderLogin} />
            <Route exact path='/' render={this.renderHome} />
            <Route exact path='/premium' render={this.renderPremium} />
            <Route exact path='/search' render={this.renderSearch} />
            <Route exact path='/movie/:id' render={this.renderMovie} />
            <Route exact path='/test' render={this.renderTest} />
            <Route exact path='/lists/makelist' render={this.renderMakeList} />
            <Route exact path='/lists' render={this.renderLists} />
            <Route exact path={'/lists/:id'} render={this.renderList} />
            <Route exact path={'/reviews'} render={this.renderMyReviews} />

            <Route
              exact
              path={'/lists/editlist'}
              render={this.renderEditList}
            />
            <Route
              exact
              path={'/searchlistresults/:id'}
              render={this.renderSearchListResults}
            />
            <Route
              exact
              path={'/searchlistresults/'}
              render={this.renderSearchListResults}
            />
            <Route exact path='/loginalert' render={this.renderLoginAlert} />
            <Route
              exact
              path='/searchtags/:id'
              render={this.renderSearchTags}
            />
            <Route exact path='/profile' component={Profile} />
          </div>
        </BrowserRouter>
      )
    } else {
      return <div>Page is loading</div>
    }
  }
}
let mapStateToProps = function (state) {
  return { lists: state.state.lists }
}

let App = connect(mapStateToProps)(UnconnectedApp)

export default App
