import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import NumberFormat from 'react-number-format'
import MovieReviews from './MovieReviews'
import AddReviewForm from './AddReviewForm'

class Movie extends Component {
  constructor(props) {
    super(props)
    this.state = { movieId: this.props.movieId, movieData: [] }
  }
  componentDidMount() {
    console.log('component did mount for Movie Component')
    console.log('props', this.props)
    let id = this.props.movieId
    this.setState({ movieId: id })
    console.log('id', id)
    axios(
      'https://api.themoviedb.org/3/movie/' +
        id +
        '?api_key=98325a9d3ed3ec225e41ccc4d360c817'
    ).then(response => {
      console.log('response', response.data)
      this.setState({ movieData: response.data })
    })

    // this.getReviews();
  }
  update = () => {
    console.log('Updating state of movie component')
    console.log('props', this.props)
    let id = this.props.movieId
    this.setState({ movieId: id })
    console.log('id', id)
    axios(
      'https://api.themoviedb.org/3/movie/' +
        id +
        '?api_key=98325a9d3ed3ec225e41ccc4d360c817'
    ).then(response => {
      console.log('response', response.data)
      this.setState({ movieData: response.data })
    })
  }

  checkIfImage = () => {
    if (this.state.movieData.backdrop_path) {
      return 'w780' + this.state.movieData.backdrop_path
    } else {
      return 'w342' + this.state.movieData.poster_path
    }
  }

  displayMovie = () => {
    return (
      <div className="container inner-container-details">
        <div className="row single-movie-holder">
          <div className="col-md-10">
            {console.log('DATA', this.state.movieData)}
            <img
              src={'https://image.tmdb.org/t/p/' + this.checkIfImage()}
              className="thumbnail"
            />
          </div>
          <div className="col-md-10 pb-2">
            <ul>
              <li className="list-group-item mt-2">
                <h3>{this.state.movieData.title}</h3>
              </li>
              <li className="list-group-item">
                {this.state.movieData.overview}
              </li>
              <li className="list-group-item">
                <strong>Released:</strong> {this.state.movieData.release_date}
              </li>
              <li className="list-group-item">
                <strong>Rated:</strong> {this.state.movieData.vote_average}/10
              </li>
              <li className="list-group-item">
                <strong>Runtime:</strong> {this.state.movieData.runtime} min.
              </li>
              <li className="list-group-item">
                <strong>Budget:</strong>{' '}
                <NumberFormat
                  value={this.state.movieData.budget}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'$'}
                />
              </li>
              <li className="list-group-item">
                <strong>Revenue:</strong>{' '}
                <NumberFormat
                  value={this.state.movieData.revenue}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'$'}
                />
              </li>
            </ul>
            <div>
              <a
                href={'http://imdb.com/title/' + this.state.movieData.imdb_id}
                target="_blank"
                className="btn button-movie-page"
              >
                See on IMDB
              </a>
              <Link to="/search" className="btn button-movie-page">
                Go To Search
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  displayReviews() {
    let getReviews = () => {}
  }
  // getReviews = () => {
  //   let that = this;
  //   console.log("fetched get reviews");
  //   axios({
  //     method: "post",
  //     data: { search: "" },
  //     url: "/api/reviews/wildsearch"
  //   }).then(response => {
  //     console.log("response", response);
  //     let allReviews = response.data.sortedRankedReviews;
  //     console.log("allReviews", allReviews);
  //     let filterMovie = elem => {
  //       if (elem.movieId === that.state.movieId) {
  //         return true;
  //       }
  //     };
  //     let relaventReviews = allReviews.filter(filterMovie);
  //     console.log("relaventReviews", relaventReviews);
  //     that.setState({ reviews: relaventReviews });
  //   });
  // };
  // renderReviews = () => {
  //   let createDomElements = elem => {
  //     return (
  //       <li>
  //         <div>email:{elem.email}</div>
  //         <div>Review:{elem.reviewText}</div>
  //       </li>
  //     );
  //   };
  //   return (
  //     <div>
  //       <h5>Reviews</h5>
  //       <ol>{this.state.reviews.map(createDomElements)}</ol>
  //     </div>
  //   );
  // };

  render() {
    return (
      <div className="container-fluid main-container-details">
        {this.displayMovie()}
        {/* {this.renderReviews()} */}
        <AddReviewForm movieId={this.state.movieId} parent={this} />
        <MovieReviews movieId={this.state.movieId} parent={this} />
      </div>
    )
  }
}

export default Movie
