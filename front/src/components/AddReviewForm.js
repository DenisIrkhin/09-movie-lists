import React, { Component } from 'react'
import '../css/style.css'
import { Redirect, Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import '../css/MakeList.css'
import { connect } from 'react-redux'
import axios from 'axios'
import App from '../App.js'
import Modal from 'react-modal'

class UnconnectedAddReviewForm extends Component {
  constructor(props) {
    super(props)
    this.state = { inputReview: '',message:"" }
  }
  componentDidMount() {
      let that=this
    console.log(
      'Component did mount---getting all reviews for the add review form'
    )
    axios({
      method: 'get',
      url: '/api/reviews'
    }).then(response => {
      console.log('response to get reviews', response)
      let allReviewsArr = response.data.reviews
      console.log('allReviewsArr', allReviewsArr)
      let filterByUser = elem => {
        if (elem.userId == that.props.userId && elem.movieId==that.props.movieId) {
          return true;
        }
      }
      let ReviewFilter = allReviewsArr.filter(filterByUser)
      console.log('ReviewFilter', ReviewFilter)
      let userReview = allReviewsArr.filter(filterByUser)[0]
      console.log('userReview', userReview)
      if (userReview) {
        that.setState({
          inputReview: userReview.reviewText,
          review: userReview
        })
      }
    })
  }
//   componentWillUpdate(prevProps,prevState){
//       if(prevState.review.reviewText!==this.state.review.reviewText){
//         axios({
//             method: "get",
//             url: "/api/reviews"
//           }).then(response => {
//             console.log("response to get reviews", response);
//             let allReviewsArr = response.data.reviews;
//             console.log("allReviewsArr", allReviewsArr);
//             let filterByUser = elem => {
//               if (elem.userId === this.props.userId && elem.movieId===this.props.movieId) {
//                 return true;
//               }
//             };
//             let ReviewFilter = allReviewsArr.filter(filterByUser)
//             console.log('ReviewFilter', ReviewFilter)
//             let userReview = allReviewsArr.filter(filterByUser)[0];
//             console.log("userReview", userReview);
//             if (userReview) {
//               this.setState({
//                 inputReview: userReview.reviewText,
//                 review: userReview
//               });
//             }
//           });
//       }
//   }

  update = () => {
      let that=this
    this.props.parent.update()
    axios({
      method: 'get',
      url: '/api/reviews'
    }).then(response => {
      console.log('response to get reviews', response)
      let allReviewsArr = response.data.reviews
      console.log('allReviewsArr', allReviewsArr)
      let filterByUser = elem => {
        if (elem.userId == that.props.userId && elem.movieId==that.props.movieId) {
          return true;
        }
      }
      let ReviewFilter = allReviewsArr.filter(filterByUser)
      console.log('ReviewFilter', ReviewFilter)
      let userReview = allReviewsArr.filter(filterByUser)[0]
      console.log('userReview', userReview)
      if (userReview) {
        that.setState({
          inputReview: userReview.reviewText,
          review: userReview
        })
      }
    })
  }
  handleInput = evt => {
    this.setState({ inputReview: evt.currentTarget.value })
  }
  handleSubmit = evt => {
    evt.preventDefault()
    if (this.state.review) {
      axios({
        method: 'put',
        url: '/api/reviews/id',
        data: {
          reviewId: this.state.review._id,
          movieId: this.props.movieId,
          reviewText: this.state.inputReview
        },
        withCredentials: true
      }).then(() => {
        this.setState({message:"Review submitted"})
        this.update()
      }).catch((e)=>{console.log('e.response.data', e.response.data)})
    } else {
      axios({
        method: 'post',
        url: '/api/reviews/',
        data: {
          movieId: this.props.movieId,
          reviewText: this.state.inputReview
        },
        withCredentials: true
      }).then(() => {
        this.setState({review:{reviewText:"Review text was changed"},message:"review submitted"})
        this.update();
      });
    }
  }
  render() {
    return (
      <div className="container inner-container-your-review">
        <form onSubmit={this.handleSubmit}>
          <h5>Your Review</h5>
          <div className="jump">{this.state.message}</div>
          <textarea
            name="reviewField"
            rows="5"
            cols="50"
            maxLength="400"
            onChange={this.handleInput}
            value={this.state.inputReview}
            className="text-area-your-review"
          />
          <input
            name="submit review"
            type="submit"
            className="submit-your-review"
            value="SUBMIT"
          />
        </form>
      </div>
    )
  }
}

let mapStateToProps = function(state) {
  return { userId: state.state.userId }
}
let AddReviewForm = connect(mapStateToProps)(UnconnectedAddReviewForm)
export default AddReviewForm
