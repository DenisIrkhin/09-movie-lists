import React, { Component } from 'react'
import '../css/style.css'
import { Redirect, Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import '../css/MakeList.css'
import { connect } from 'react-redux'
import axios from 'axios'
import App from '../App.js'
import Modal from 'react-modal'

class UnconnectedMyReviews extends Component {
  constructor(props) {
    super(props)
    this.state = { reviews: [] }
  }
  componentDidMount = () => {
    let that = this
    console.log('Fetching all of users reviews')

    this.update()
  }
  update(){
    let that=this
    axios({
      method: 'get',
      url: '/api/reviews/',
      withCredentials: true
    }).then(response => {
      console.log('response', response)
      let reviews = response.data.reviews
      console.log('reviews', reviews)
      let promises = []
      reviews.forEach(elem => {
        let promise = axios(
          'https://api.themoviedb.org/3/movie/' +
            elem.movieId +
            '?api_key=98325a9d3ed3ec225e41ccc4d360c817&language=en-US'
        )
          .then(response => {
            console.log('response.data', response.data)
            elem.movieObj = response.data
            console.log('elem with object added', elem)
          })

          .catch(() => console.log('caught'))
        promises.push(promise)
      })

      Promise.all(promises).then(() => {
        that.setState({ reviews: reviews })
      })
      //   let updateReview=setTimeout(()=>{
      //     that.setState({reviews:reviews})
      //       console.log("reviews set",reviews)},1000)
    })
  }
  deleteReview = reviewId => {
    let that=this
    console.log('deleting review')
    // let reqBody={reviewId:reviewId}
    let reqBody = {reviewId:reviewId}
    console.log('reqBody', reqBody)
    axios({
      method: 'delete',
      url: '/api/reviews/id',
      data: reqBody,
      withCredentials: true
    })
      .then(() => {
        console.log('deleted review', reviewId)
        that.update()
      })
      .catch(e => {
        console.log('error', e.response)
      })
  }

  renderReviews = () => {
    let elemToDOM = elem => {
      if (elem.movieObj) {
        return (
          <div className="single-review-holder">
            <Link to={'/movie/' + elem.movieObj.id}>
              <div className="movie-title-my-reviews">
                {elem.movieObj.original_title}
              </div>
            </Link>
            <span
              className="fas fa-trash-alt MouseOver ml-1 mr-1 icon-lists trash-my-reviews"
              onClick={() => {
                this.deleteReview(elem._id)
              }}
            />
            <div>{elem.reviewText}</div>
          </div>
        )
      }
    }
    return this.state.reviews.map(elemToDOM)
  }

  render() {
    if (this.props.loggedIn === false) {
      return <Redirect to={'./loginalert'} />
    }

    return (
      <div className="container-fluid main-container-my-reviews">
        <div className="container pt-4">
          <h2 className="text-center mb-5 mt-4">My Reviews</h2>
          <div class="my-review-holder mt-2"> {this.renderReviews()}</div>
        </div>
      </div>
    )
  }
}

let mapStateToProps = function(state) {
  return { loggedIn: state.state.loggedIn }
}

let MyReviews = connect(mapStateToProps)(withRouter(UnconnectedMyReviews))

export default MyReviews
