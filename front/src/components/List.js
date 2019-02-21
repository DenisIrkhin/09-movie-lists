import React, { Component } from "react";
import "../css/style.css";
import { Redirect, Link } from "react-router-dom";
import "../css/LoginSignup.css";
import { connect } from "react-redux";
import axios from "axios";
import App from "../App.js";
import Modal from "react-modal";

class UnconnnectedList extends Component {
  constructor(props) {
    super(props);
    this.state = { list: [] };
    this.displayList = this.displayList.bind(this);
  }
  componentDidMount() {
    let that = this;
    console.log("getting item id");
    let path = window.location.pathname;
    console.log("path", path);
    let pathArr = path.split("/");
    console.log("pathArr", pathArr);
    let listId = pathArr[pathArr.length - 1];
    console.log("listId", listId);
    this.setState({ listId: listId });
    console.log("Fetching from endpoint lists/id");
    axios({
      method: "post",
      url: "/api/lists/id",
      data: { listId: listId },
      withCredentials: "include"
    }).then(response => {
      console.log("response", response);
      that.setState({ list: response.data.list });
    });
  }
  displayList() {
    try {
      console.log("movie array", this.state.list.movieArr);
      if (
        this.state.list.movieArr === undefined ||
        this.state.list.movieArr.length === 0
      ) {
        return <h4>There is no list to be displayed</h4>;
      } else {
        return (
          <div>
            <h4>List:{this.state.list.name}</h4>
            <ol>
              {this.state.list.movieArr.map(function(elem) {
                return (
                <div>
                  
                <Link to={"/movies/"+elem.id}><li style={{margin:"10px"}}><img src={"https://image.tmdb.org/t/p/w500" + elem.poster_path} style={{maxHeight:"50px"}}></img>{elem.original_title}</li></Link>
                </div>
                )
              })}
            </ol>
          </div>
        );
      }
    } catch {}
  }
  render() {
    console.log("rendered component list for id", this.listId);
    console.log("ListId", this.props.listId);
    return <div>{this.displayList()}</div>;
  }
}

// let mapStateToProps=function(state){
//     return {}
// }

let List = connect()(UnconnnectedList);

export default List;
