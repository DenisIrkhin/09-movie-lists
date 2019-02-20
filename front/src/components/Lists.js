import React, { Component } from "react";
import "../css/style.css";
import { Redirect, Link } from "react-router-dom";
import "../css/LoginSignup.css";
import { connect } from "react-redux";
import axios from "axios";
import App from "../App.js";
import { withRouter } from 'react-router'
import Modal from "react-modal";
import { isThisQuarter } from "date-fns";

class UnconnectedLists extends Component {
  constructor(props) {
    super(props);
    this.displayLists = this.displayLists.bind(this);
    this.deleteList=this.deleteList.bind(this)
  }
  componentDidMount() {
    
    console.log("fetched to get list");
    console.log("url: /api/lists");
    axios({
      method: "get",
      url: "/api/lists",
      withCredentials: true
    }).then(response => {
      console.log("response", response);
      let responseLists = response.data.lists;
      console.log("responseLists", responseLists);
      this.props.dispatch({ type: "getLists", payload: responseLists });
      
  })}

  fetchList(){
    console.log("fetched to get list");
    console.log("url: /api/lists");
    axios({
      method: "get",
      url: "/api/lists",
      withCredentials: true
    }).then(response => {
      console.log("response", response);
      let responseLists = response.data.lists;
      console.log("responseLists", responseLists);
      this.props.dispatch({ type: "getLists", payload: responseLists });
      
  })
  }

  deleteList(listId) {
    let that=this
    console.log('listId', listId)
    console.log("fetch request /api/lists/delete");
    axios({
      method: "delete",
      url: "/api/lists/id",
      data:{listId:listId},
      withCredentials: true
    }).then(response => {
      console.log("response", response);
      console.log('response.message', response.message)
      that.fetchList()
    });
  }

  displayLists() {
    let that=this
    try {
      let listsArr = this.props.lists;
      console.log("listsArr", listsArr);

      function createListElements(elem,index) {
        // console.log('elem', elem)
        // console.log('index', index)

        return (
          <li>
            <Link to={"lists/" + elem._id}>
              <span>{elem.name}</span>
            </Link>
            <span style={{ float: "right" }}>
              <span name="edit" className="far fa-edit MouseOver " />
              <span
                name="delete"
                className="fas fa-trash-alt MouseOver "
                onClick={()=>that.deleteList(elem._id)}
              />
            </span>
          </li>
        );
      }
      if (!listsArr.length) {
        return (
          <div>
            <h4>No Lists have been created yet</h4>
            <Link to="/lists/makelist">Create a List</Link>
          </div>
        );
      } else {
        console.log("listsArr to be mapped",listsArr)
        return listsArr.map(createListElements);
      }
    } catch {}
  }

  render() {
    if(!this.props.loggedIn){
      return(<Redirect to="/loginalert"></Redirect>)
    }else{
      return (
        <div>
          <h2>Your Lists</h2>
          <ol>{this.displayLists()}</ol>
        </div>
      );
    
  }}
}

let mapStateToProps = function(state) {
  return { lists: state.state.lists, loggedIn: state.state.loggedIn };
};
let Lists = connect(mapStateToProps)(withRouter(UnconnectedLists));

export default Lists;
