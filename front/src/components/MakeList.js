import React, { Component } from "react";
import "../css/style.css";
import { Redirect, Link } from "react-router-dom";
import "../css/LoginSignup.css";
import { connect } from "react-redux";
import axios from "axios";
import App from "../App.js";
import Modal from "react-modal";

class ListPropertiesForm extends Component {
  constructor(props) {
    super(props);
    
    this.changeCategory=this.changeCategory.bind(this)
  }
  changeCategory(e){
    this.props.parent.setState({category:e.currentTarget.value})
  }
  

  render() {
    return (
      <form>
        <span>List Name:</span>
        <input type="text" placeholder="List Name"  />

        <select id="categoryDropdown" size onChange={this.changeCategory}>
          <option value="category 1">category 1</option>
          <option value="category 2">category 2</option>
          <option value="category 3">category 3</option>
          <option value="category 4">category 4</option>
        </select>
      </form>
    );
  }
}

class MakeList extends Component {
  constructor(props) {
    super(props);
    this.state={category:"",}
  }
  render() {
    return (
      <div>
        <h2>Make A List</h2>
        <ListPropertiesForm parent={this}/>
      </div>
    );
  }
}

export default MakeList;
