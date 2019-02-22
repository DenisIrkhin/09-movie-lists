import React, { Component } from 'react'
import axios from 'axios'
import $ from 'jquery'

class Movie extends Component {
  constructor(props){
    super(props)
    this.state={movieId:""}
    this.displayMovie=this.displayMovie.bind(this)
  }
  componentDidMount(){
    console.log("component did mount for Movie Component")
    console.log("props",this.props)
    let id=this.props.movieId
    this.setState({movieId:id})
    console.log('id', id)
    axios(
      'https://api.themoviedb.org/3/movie/' +
        id +
        '?api_key=98325a9d3ed3ec225e41ccc4d360c817'
    ).then((response)=>{
      console.log('response', response)
      this.displayMovie(response.data)


    }
    )
  }

  displayMovie(movie){
    return (
      <div>
        <h1>movieId={this.state.movieId}</h1>
      </div>
    )

  }
  render() {
    return (
      <div className="container-fluid main-container-details">
        {this.displayMovie()}
      </div>
    )
  }
}

export default Movie
