import React, { Component } from "react";
import "../css/style.css";
import { Redirect, Link } from "react-router-dom";
import "../css/LoginSignup.css";
import { connect } from "react-redux";
import axios from "axios";
import App from "../App.js";
import Modal from "react-modal";

class UnconnectedLists extends Component {
  constructor(props) {
    super(props);
    this.displayLists=this.displayLists.bind(this)
  }
  componentDidMount() {
    console.log("fetched to get list");
    axios({
      method: "get",
      url: "http://localhost:5050/lists",
      withCredentials: true
    }).then(response => {
      console.log("response", response);
      let responseLists = response.data.lists;
      console.log("responseLists", responseLists);
      this.props.dispatch({ type: "getLists", payload: responseLists });
    });
  }
  displayLists() {
      try{

      
    let listsArr = this.props.lists;
    console.log("listsArr", listsArr);
    function createListElements(elem) {
      return (
        <li>
          <h4>{elem.name}</h4>
          {/* the comment below will include the list elemens of each individual list. ex: "movie1,movie2,movie3" */}
          {/* <ol>
            {elem.movieArr.map(function(elem) {
              return <li>{elem}</li>;
            })}
          </ol> */}
        </li>
      );
    }
    if(!listsArr.length){
        return <div>
            <h4>No Lists have been created yet</h4>
            <Link to="/lists/makelist">Create a List</Link>
        </div>
    }else{
        return listsArr.map(createListElements)
    }
    
}catch{}
  }
  

  render() {
    return (
      <div>
        <h2>Your Lists</h2>
        <ol >
            {this.displayLists()}
        </ol>
      </div>
    );
  }
}

let mapStateToProps = function(state) {
  return { lists: state.state.lists };
};
let Lists = connect(mapStateToProps)(UnconnectedLists);

export default Lists;
