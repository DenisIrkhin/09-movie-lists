import React, { Component } from "react";
import "../css/style.css";
import { Redirect, Link } from "react-router-dom";
import "../css/LoginSignup.css";
import { connect } from "react-redux";
import axios from "axios";
import App from "../App.js";
import Modal from "react-modal";


class TagsBody extends Component {
  constructor(props) {
    super(props);
    this.state = { inputText: "", tags: [] };
    this.handleInputText = this.handleInputText.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleInputText(evt) {
    this.setState({ inputText: evt.currentTarget.value });
  }
  //adds tag
  handleSubmit(evt) {
    evt.preventDefault();
    if (this.state.inputText.length) {
      console.log('adding tag', this.state.inputText)
      this.setState({
        tags: this.state.tags.concat(this.state.inputText),
        inputText: ""
      })
    }
  }

  displayTags(){
    let that=this
    return this.state.tags.map((elem,index)=>{
      return <span className="tag">
        {elem}<span name={index} className="fas fa-tag" onClick={(evt)=>{
          console.log("i just clicked on a tag")
          let oldTagArr=that.state.tags.slice(0)
          console.log('oldTagArr', oldTagArr)
          let newTagArr=oldTagArr.slice(0)
          newTagArr.splice(index,1)
          console.log('newTagArr', newTagArr)
          that.setState({tags:newTagArr})

        }}></span>
      </span>
    })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" onChange={this.handleInputText} value={this.state.inputText}/>
          <div style={{maxWidth:"500px",margin:"auto"}}>{this.displayTags()}</div>
        </form>
      </div>
    );
  }
}

class ListPropertiesForm extends Component {
  constructor(props) {
    super(props);

    this.changeCategory = this.changeCategory.bind(this);
  }
  changeCategory(e) {
    this.props.parent.setState({ category: e.currentTarget.value });
  }

  render() {
    return (
      <form>
        <div>
          <span>List Name:</span>
          <input type="text" placeholder="List Name" />
        </div>
        {/* <select id="categoryDropdown" size onChange={this.changeCategory}>
          <option value="Top 5">Top 5</option>
          <option value="Top 10">Top 10</option>
          <option value="Top 20">Top 20</option>
          <option value="category 4">category 4</option>
        </select> */}
        <div>
          <h5>input tags</h5>
          <TagsBody />
        </div>
        <div>
          <h4>Description</h4>
          <textarea name="description" cols="40" rows="5" />
        </div>
      </form>
    );
  }
}

class MakeList extends Component {
  constructor(props) {
    super(props);
    this.state = { category: "" };
  }
  render() {
    return (
      <div>
        <h2>Make A List</h2>
        <ListPropertiesForm parent={this} />
      </div>
    );
  }
}

export default MakeList;
