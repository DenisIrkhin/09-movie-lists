import React, { Component } from "react";
import "../css/style.css";
import { Redirect, Link } from "react-router-dom";
import { withRouter } from "react-router";

import "../css/MakeList.css";
import { connect } from "react-redux";
import axios from "axios";
import App from "../App.js";
import Modal from "react-modal";

class MyReviews extends Component {
  constructor(props) {
    super(props);
    this.state = { reviews: [] };
  }
  componentDidMount = () => {
      let that=this
    console.log("Fetching all of users reviews")
    
    axios({
      method: "get",
      url: "/api/reviews/",
      withCredentials: true
    }).then(response => {
      console.log("response", response);
      let reviews = response.data.reviews;
      console.log("reviews", reviews);
      let promises=[]
      reviews.forEach((elem) => {
          let promise=axios(
            "https://api.themoviedb.org/3/movie/" +
              elem.movieId +
              "?api_key=98325a9d3ed3ec225e41ccc4d360c817&language=en-US"
          ).then(response => {
            console.log("response.data", response.data);
            elem.movieObj=response.data
            console.log("elem with object added",elem)
          })
          
          .catch(()=>console.log("caught"))
          promises.push(promise)
      })

      Promise.all(promises).then(()=>{that.setState({reviews:reviews})})
    //   let updateReview=setTimeout(()=>{
    //     that.setState({reviews:reviews})
    //       console.log("reviews set",reviews)},1000)
    })

  };

  renderReviews = () => {
    
    let elemToDOM = elem => {
        if(elem.movieObj){
            return(
                <div>
                    <Link to={"/movie/"+elem.movieObj.id}><div>{elem.movieObj.original_title}</div></Link>
                    <div>{elem.reviewText}</div>
                </div>
            )
        }
      
    };
    return this.state.reviews.map(elemToDOM)
  };

  render() {
    return (
      <div>
        <h3>Your Reviews</h3>
        {this.renderReviews()}
      </div>
    );
  }
}



export default MyReviews
