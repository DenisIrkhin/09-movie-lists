import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css'
import {connect} from 'react-redux'
import Test from './components/Test'
// import thunk from 'redux-thunk'
// For future using
import Navbar from './components/Navbar'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import MakeList from './components/MakeList'
import Lists from './components/Lists'
import List from './components/List'





class UnconnectedApp extends Component {
  constructor(props){
    super(props)
    
  }
  // Render Test comp for fetch data from mongo and understand that it works
  renderTest() {
    console.log("test page rendered")
    return (
      <div>
        <Signup />
      </div>
    )
  }
  renderSignup(){
    console.log("signup component rendered")
    return(
      <Signup></Signup>
    )
  }
  renderLogin(){
    console.log("login component rendered")
    return (
      <Login></Login>
    )
  }
  renderMakeList(){
    console.log("makeList component rendered")
    return(
      <MakeList></MakeList>
    )
  }
  renderLists(routerData){
    console.log("lists component rendered")
    return(
      <Lists></Lists>
    )
  }
  renderList(routerData){
    console.log("specific list component rendered")
    console.log("path of list",routerData.match.params.id)
    return(
      <List listId={routerData.match.params.id} />
    )
    
  }

  render() {
  
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Home />
          <Route exact path="/signup" render={this.renderSignup}/>
          <Route exact path="/login" render={this.renderLogin}/>
          <Route exact path="/test" render={this.renderTest} />
          <Route exact path="/lists/makeList" render={this.renderMakeList}/>
          <Route exact path="/lists" render={this.renderLists}/>
          <Route exact path={"/lists/:id"} render={this.renderList}/>

        </div>
      </BrowserRouter>
    )
  }
}
let mapStateToProps = function (state) {
  return { ...state}
}

let App = connect(mapStateToProps)(UnconnectedApp)

export default App
