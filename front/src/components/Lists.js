import React, { Component } from 'react'
import '../css/style.css'
import { Redirect, Link } from 'react-router-dom'
import '../css/LoginSignup.css'
import { connect } from 'react-redux'
import axios from 'axios'
import App from '../App.js'
import { withRouter } from 'react-router'
import Modal from 'react-modal'
import { isThisQuarter } from 'date-fns'
import { EditLists } from './EditList'
import { FacebookShareButton, TwitterShareButton } from 'react-share'

class UnconnectedLists extends Component {
  constructor(props) {
    super(props)
    this.state = { uniqueTags: [] }
    this.displayLists = this.displayLists.bind(this)
    this.deleteList = this.deleteList.bind(this)
    this.editList = this.editList.bind(this)
    this.setDisplayedTags = this.setDisplayedTags.bind(this)
    this.displayTags = this.displayTags.bind(this)
  }

  componentDidMount() {
    console.log('fetched to get list')
    console.log('url: /api/lists')
    axios({
      method: 'get',
      url: '/api/lists',
      withCredentials: true
    }).then(response => {
      console.log('response', response)
      let responseLists = response.data.lists
      console.log('responseLists', responseLists)
      this.props.dispatch({ type: 'getLists', payload: responseLists })
      this.setDisplayedTags()
    })
  }

  fetchList() {
    let that = this
    console.log('fetched to get list')
    console.log('url: /api/lists')
    axios({
      method: 'get',
      url: '/api/lists',
      withCredentials: true
    }).then(response => {
      console.log('response', response)
      let responseLists = response.data.lists
      console.log('responseLists', responseLists)
      this.props.dispatch({ type: 'getLists', payload: responseLists })
      that.setDisplayedTags()
    })
  }

  editList(list) {
    this.props.dispatch({ type: 'editList', payload: list })
    this.props.history.push('./lists/editlist')
  }

  deleteList(listId) {
    let that = this
    console.log('listId', listId)
    console.log('fetch request /api/lists/delete')
    axios({
      method: 'delete',
      url: '/api/lists/id',
      data: { listId: listId },
      withCredentials: true
    }).then(response => {
      console.log('response', response)
      console.log('response.message', response.message)
      that.fetchList()
    })
  }

  displayLists() {
    let that = this
    try {
      let listsArr = this.props.lists
      console.log('listsArr', listsArr)

      function createListElements(elem, index) {
        // console.log('elem', elem)
        // console.log('index', index)

        return (
          <li className="each-list">
            <Link to={'lists/' + elem._id}>
              <span className="title-lists">{elem.name}</span>
            </Link>
            <span className="lists-icons">
              <FacebookShareButton
                url={window.location.origin + '/lists/' + elem._id}
                className={'fab fa-facebook ml-1 mr-1 icon-lists'}
              />
              <TwitterShareButton
                url={window.location.origin + '/lists/' + elem._id}
                className={'fab fa-twitter-square ml-1 mr-1 icon-lists'}
              />
              <span
                name="edit"
                className="far fa-edit MouseOver ml-1 mr-1 icon-lists"
                onClick={() => {
                  that.editList(elem)
                }}
              />
              <span
                name="delete"
                className="fas fa-trash-alt MouseOver ml-1 mr-1 icon-lists"
                onClick={() => that.deleteList(elem._id)}
              />
            </span>
          </li>
        )
      }
      if (!listsArr.length) {
        return (
          <div>
            <h4>No Lists have been created yet</h4>
            <Link to="/lists/makelist">Create a List</Link>
          </div>
        )
      } else {
        console.log('listsArr to be mapped', listsArr)
        return listsArr.map(createListElements)
      }
    } catch {}
  }

  displayTags() {
    let renderDomElement = elem => {
      return (
        <Link to={'./searchtags/' + elem}>
          <span className="lists-tag ml-1 mr-1">
            {elem} <span className="fas fa-tag" />
          </span>
        </Link>
      )
    }
    return this.state.uniqueTags.map(renderDomElement)
  }
  setDisplayedTags() {
    if (true) {
      console.log('displaying all tags in the lists.....')
      let getListTagsArr = list => {
        // console.log("specific list tags",list.tags.split(" ^^ "))
        return list.tags.split(' ^^ ')
      }
      let getArrAllTags = lists => {
        console.log('called ArrAllTags')
        console.log('lists', lists)
        let ret = []
        lists.forEach(list => {
          // console.log('list', list)
          // console.log('ret before', ret)
          ret = ret.concat(getListTagsArr(list))
          // console.log('retAfter', ret)
        })
        // console.log('ret', ret)
        return ret
      }
      let ArrAllTags = getArrAllTags(this.props.lists)
      console.log('ArrAllTags', ArrAllTags)
      let tagSet = new Set(ArrAllTags)
      console.log('tagSet', tagSet)
      let uniqueTagsArr = Array.from(tagSet)
      console.log('uniqueTagsArr', uniqueTagsArr)

      this.setState({ uniqueTags: uniqueTagsArr })
    }
  }

  render() {
    if (!this.props.loggedIn) {
      return <Redirect to="/loginalert" />
    } else {
      return (
        <div className="row">
          <div className="container-fluid main-container-lists">
            <div className="container">
              <div className="row">
                <ul className="col-md-8 lists-holder">
                  <h4 className="text-center mb-3">Your Lists</h4>
                  {this.displayLists()}
                </ul>

                <div className="col-md-3 tags-holder-lists">
                  <h4 className="text-center mb-3">Your Tags</h4>
                  {this.displayTags()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

let mapStateToProps = function(state) {
  return { lists: state.state.lists, loggedIn: state.state.loggedIn }
}
let Lists = connect(mapStateToProps)(withRouter(UnconnectedLists))

export default Lists
