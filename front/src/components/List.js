import React, { Component } from 'react'
import '../css/style.css'
import { Redirect, Link } from 'react-router-dom'
import '../css/LoginSignup.css'
import { connect } from 'react-redux'
import axios from 'axios'
import App from '../App.js'
import Modal from 'react-modal'
import { FacebookShareButton, TwitterShareButton } from 'react-share'

class UnconnnectedList extends Component {
  constructor(props) {
    super(props)
    this.state = { list: [] }
    this.displayList = this.displayList.bind(this)
  }
  componentDidMount() {
    let that = this
    console.log('getting item id')
    let path = window.location.pathname
    console.log('path', path)
    let pathArr = path.split('/')
    console.log('pathArr', pathArr)
    let listId = pathArr[pathArr.length - 1]
    console.log('listId', listId)
    this.setState({ listId: listId })
    console.log('Fetching from endpoint lists/id')
    axios({
      method: 'post',
      url: '/api/lists/id',
      data: { listId: listId },
      withCredentials: 'include'
    }).then(response => {
      console.log('response', response)
      that.setState({ list: response.data.list })
    })
  }
  displayList() {
    try {
      console.log('movie array', this.state.list.movieArr)
      if (
        this.state.list.movieArr === undefined ||
        this.state.list.movieArr.length === 0
      ) {
        return <h4>There is no list to be displayed</h4>
      } else {
        return (
          <div className="container-fluid main-container-list">
            <div className="container">
              <div className="title-social-list">
                <h3>List: {this.state.list.name}</h3>
                <span className="list-icons">
                  <FacebookShareButton
                    url={window.location.href}
                    className={'fab fa-facebook ml-1 mr-1 icon-list'}
                  />
                  <TwitterShareButton
                    url={window.location.href}
                    className={'fab fa-twitter-square ml-1 mr-1 icon-list'}
                  />
                </span>
              </div>
              <ol className="single-list-holder">
                {this.state.list.movieArr.map(function(elem) {
                  return (
                    <div>
                      <li className="list-item">
                        <img
                          src={
                            'https://image.tmdb.org/t/p/w500' + elem.poster_path
                          }
                          style={{ maxHeight: '50px' }}
                        />
                        <Link to={'/movie/' + elem.id}>
                          <span className="title-list">
                            {elem.original_title}
                          </span>
                        </Link>
                      </li>
                    </div>
                  )
                })}
              </ol>
            </div>
          </div>
        )
      }
    } catch {}
  }
  render() {
    console.log('rendered component list for id', this.listId)
    console.log('ListId', this.props.listId)
    return <div>{this.displayList()}</div>
  }
}

// let mapStateToProps=function(state){
//     return {}
// }

let List = connect()(UnconnnectedList)

export default List
