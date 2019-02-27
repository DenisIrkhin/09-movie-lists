import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import NumberFormat from 'react-number-format'
import Movie from './Movie'

class MovieReviews extends Component {
  constructor(props) {
    super(props)
    this.state = { movieId: this.props.movieId, reviews: [] }
  }

  componentDidMount() {
    console.log('component did mount movie reviews---------------')

    this.getReviews()
  }
  // componentWillReceiveProps(){
  //     this.getReviews()
  // }
  componentWillUpdate(prevProps, prevState) {
    if (prevState.reviews === this.state.reviews) {
      this.getReviews()
    }
  }

  getReviews = () => {
    let that = this
    console.log('fetched get reviews')
    axios({
      method: 'post',
      data: { search: '' },
      url: '/api/reviews/wildsearch'
    }).then(response => {
      console.log('response', response)
      let allReviews = response.data.sortedRankedReviews
      console.log('allReviews', allReviews)
      let filterMovie = elem => {
        //   console.log('elem', elem)
          if (elem.movieId == that.state.movieId) {
            return true;
          }
        };
        let relaventReviews = allReviews.filter(filterMovie);
        console.log("relaventReviews", relaventReviews);
        that.setState({ reviews: relaventReviews });
      });
    };
    render() {
        console.log("render MovieReviews ---------------------")
      let createDomElements = elem => {
        return (
          <li>
            <div>User:{elem.user.username}</div>
            <div>Review:{elem.reviewText}</div>
          </li>
        );
      };
    
    return (
      <div className="container all-reviews-movie-container">
        <h5 className="title-all-review-movie">Reviews</h5>
        <ol className="list-holder-all-reviews">
          {this.state.reviews.map(createDomElements)}
        </ol>
      </div>
    )
  }
}

export default MovieReviews
