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
    this.state = { listId: this.props.listId, list: ["movie1","movie2","movie3","movie4"] };
    this.displayList=this.displayList.bind(this)
}
  componentDidMount() {
    axios({
      method: "post",
      url: "",
      data: "",
      withCredentials: "include"
    }).then(response=>{
        
    })
  }
  displayList() {
    if (!this.state.list.length) {
      return <h4>There is no list to be displayed</h4>;
    } else {
      return (
          <div>
              <h4>list.name.Ex:My top 10 lists</h4>
        <ol>
          {this.state.list.map(function(elem) {
            return <li>{elem}</li>;
          })}
        </ol>
        </div>
      );
    }
  }
  render() {
    console.log("rendered component list for id",this.listId)
    console.log("ListId", this.props.listId);
    return <div>{this.displayList()}</div>;
  }
}

// let mapStateToProps=function(state){
//     return {}
// }

let List = connect()(UnconnnectedList);

export default List;
