import React, { Component } from 'react'
import '../css/style.css'
import { Redirect, Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import '../css/MakeList.css'
import { connect } from 'react-redux'
import axios from 'axios'
import App from '../App.js'
import Modal from 'react-modal'
import MovieSearchBody from './MakeListSearchMovie'

const ModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '50000000000'
  }
}

class ChosenMovies extends Component {
  constructor(props) {
    super(props)
    this.displayMovies = this.displayMovies.bind(this)
  }

  displayMovies() {
    let addSignVisibility = 'visible'
    if (this.props.parent.state.chosenMovies.length < 1) {
      addSignVisibility = 'hidden'
    }
    // let imageAnimationStyle = { width: '60px', height: '90px' }
    // let showTrashIcon=()=>{
    //   imageAnimationStyle={width:"600px"}
    // }
    console.log('displaying movies')
    let moviesArr = this.props.parent.state.chosenMovies

    let movieDOMSArr = moviesArr.map((elem, index) => {
      return (
        <span
          className="each-chosen-movie-holder"
          onClick={() => this.removeMovie(elem, index)}
        >
          <img
            className="image-inside-list"
            src={'https://image.tmdb.org/t/p/w500' + elem.poster_path}
            // onClick={() => this.removeMovie(elem, index)}
            // onMouseOver={()=>{showTrashIcon()}}
          />
          <div className="middle">
            <a href="#" className="icon-trash">
              <i className="far fa-trash-alt" />
            </a>
          </div>
          {/* <div className="image-inside-list-title">{elem.original_title}</div> */}
        </span>
      )
    })
    return movieDOMSArr
  }

  removeMovie(elem, index) {
    console.log('removing Movie')
    console.log('elem', elem)
    console.log('index', index)
    let oldArr = this.props.parent.state.chosenMovies
    console.log('oldArr', oldArr)
    let newArr = oldArr.slice(0)
    newArr.splice(index, 1)
    console.log('newArr', newArr)
    this.props.parent.setState({ chosenMovies: newArr })
  }

  render() {
    return <div className="row row-bottom-make">{this.displayMovies()}</div>
  }
}

class TagsBody extends Component {
  constructor(props) {
    super(props)
    this.handleInputTag = this.handleInputTag.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleInputTag(evt) {
    //this adds constraints to input tags field. for example ^ cant be used and no more than 15 characters
    if (
      evt.target.value[evt.target.value.length - 1] === '^' ||
      evt.target.value.length >= 25
    ) {
      return
    }
    this.props.grandParent.setState({ inputTag: evt.currentTarget.value })
  }
  //adds tag
  handleSubmit(evt) {
    evt.preventDefault()
    if (this.props.grandParent.state.inputTag.trim().length) {
      console.log('adding tag', this.props.grandParent.state.inputTag)
      if (this.props.grandParent.state.tags.length <= 10) {
        this.props.grandParent.setState({
          tags: this.props.grandParent.state.tags.concat(
            this.props.grandParent.state.inputTag
          ),
          inputTag: '',
          message: ''
        })
      } else {
        this.props.grandParent.setState({
          message: 'Lists can only have a maximum of 10 tags'
        })
      }
    }
  }

  displayTags() {
    let that = this
    return this.props.grandParent.state.tags.map((elem, index) => {
      return (
        <div className="tag">
          {elem}
          <span
            name={index}
            className="fas fa-tag ml-2"
            data-fa-transform="rotate-30"
            onClick={evt => {
              console.log('evt', evt)
              console.log('i just clicked on a tag')
              let oldTagArr = that.props.grandParent.state.tags.slice(0)
              console.log('oldTagArr', oldTagArr)
              let newTagArr = oldTagArr.slice(0)
              newTagArr.splice(index, 1)
              console.log('newTagArr', newTagArr)
              that.props.grandParent.setState({ tags: newTagArr })
            }}
          />
        </div>
      )
    })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            onChange={this.handleInputTag}
            name="tag"
            value={this.props.grandParent.state.inputTag}
            autoComplete="off"
          />
          <div className="tags-holder">{this.displayTags()}</div>
        </form>
      </div>
    )
  }
}

class ListPropertiesForm extends Component {
  constructor(props) {
    super(props)

    this.inputTextHandler = this.inputTextHandler.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  inputTextHandler(e) {
    if (e.target.name === 'listName') {
      this.props.parent.setState({ inputTitle: e.currentTarget.value })
    } else if (e.target.name === 'description') {
      this.props.parent.setState({ inputDescription: e.currentTarget.value })
    }
  }
  handleSubmit(e) {
    e.preventDefault()
    if (e.target[0].name === 'tag') {
    } else if (this.props.parent.state.inputTitle.length !== 0) {
      this.props.parent.setState({ modalIsOpen: true })
    } else {
      this.props.parent.setState({ message: 'List title may not be empty' })
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="form-make-list">
        <h6>List Name:</h6>
        <input
          type="text"
          name="listName"
          className="list-name mb-3"
          onChange={this.inputTextHandler}
        />

        <h6>Description:</h6>
        <textarea
          name="description"
          onChange={this.inputTextHandler}
          className="text-area-make mb-3"
        />
        <h6>Input Tags:</h6>
        <TagsBody grandParent={this.props.parent} />
        <input type="submit" className="btn make-submit-button" />
      </form>
    )
  }
}

class UnconnectedMakeList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputTitle: '',
      inputDescription: '',
      inputTag: '',
      chosenMovies: [],
      tags: [],
      message: '',
      confirmedFinishedList: false,
      modalIsOpen: false
    }
    this.displayMessage = this.displayMessage.bind(this)
    this.openModal = this.openModal.bind(this)
    this.afterOpenModal = this.afterOpenModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.addList = this.addList.bind(this)
  }

  openModal() {
    this.setState({ modalIsOpen: true })
  }
  afterOpenModal() {
    // this.subtitle.style.color="#f00"
  }
  closeModal() {
    this.setState({ modalIsOpen: false })
  }
  displayMessage() {
    if (this.state.message) {
      return (
        <div className="jump" style={{ color: 'red' }}>
          {this.state.message}
        </div>
      )
    }
  }

  addList() {
    let that = this
    //tags will be sent as a string which separates the movies with ^^ .
    let tagBody = this.state.tags.join(" ^^ ");
    let reqBody = {
      name: this.state.inputTitle,
      movieArr: this.state.chosenMovies, /////TODO
      description: this.state.inputDescription,
      tags: tagBody
    }
    console.log('commencing fetch at endpoint /lists/add ')
    axios({
      method: 'post',
      url: '/api/lists/add',
      data: reqBody,
      withCredentials: 'include'
    })
      .then(response => {
        console.log('response', response)
        if (response.data.success) {
          console.log('successful request')
          that.setState({ confirmedFinishedList: true })
          that.props.history.push('/lists')
        } else {
          console.log('error in request')
        }
      })
      .catch(() => console.log('error in request'))
  }

  render() {
    if (!this.props.loggedIn) {
      return <Redirect to="/loginalert" />
    } else {
      return (
        <div className="container-fluid main-container-make">
          <h2 className="">Make A List</h2>
          {this.displayMessage()}
          <div className="container-fluid make-holder">
            <div className="row row-top-make p-0">
              <div className="col-md-6 p-2 form-holder-make">
                <ListPropertiesForm parent={this} />
              </div>
              <div className="col-md-6 search-holder-make">
                <MovieSearchBody parent={this} />
              </div>
            </div>
          </div>
          <h4>Your Chosen Movies</h4>
          <div className="container container-movies-chosen">
            <ChosenMovies parent={this} />
          </div>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={ModalStyles}
          >
            <h5>Confirm to finish making List</h5>
            <button onClick={this.addList}>Confirm</button>
            <button onClick={() => this.setState({ modalIsOpen: false })}>
              Not yet
            </button>
          </Modal>
        </div>
      )
    }
  }
}

let mapStateToProps = function(state) {
  return { loggedIn: state.state.loggedIn }
}

let MakeList = connect(mapStateToProps)(withRouter(UnconnectedMakeList))

export default MakeList
