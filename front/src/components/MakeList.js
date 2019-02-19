import React, { Component } from "react";
import "../css/style.css";
import { Redirect, Link } from "react-router-dom";
import { withRouter } from "react-router";

import "../css/MakeList.css";
import { connect } from "react-redux";
import axios from "axios";
import App from "../App.js";
import Modal from "react-modal";

const ModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    zIndex: "50000000000"
  }
};

class TagsBody extends Component {
  constructor(props) {
    super(props);

    this.handleInputTag = this.handleInputTag.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleInputTag(evt) {
    if(evt.target.value[evt.target.value.length-1]==="^"){
      return
    }
    this.props.grandParent.setState({ inputTag: evt.currentTarget.value });
  }
  //adds tag
  handleSubmit(evt) {
    evt.preventDefault();
    if (this.props.grandParent.state.inputTag.trim().length) {
      console.log("adding tag", this.props.grandParent.state.inputTag);
      this.props.grandParent.setState({
        tags: this.props.grandParent.state.tags.concat(
          this.props.grandParent.state.inputTag
        ),
        inputTag: ""
      });
    }
  }

  displayTags() {
    let that = this;
    return this.props.grandParent.state.tags.map((elem, index) => {
      return (
        <span className="tag">
          {elem}
          <span
            name={index}
            className="fas fa-tag"
            onClick={evt => {
              console.log("evt", evt);
              console.log("i just clicked on a tag");
              let oldTagArr = that.props.grandParent.state.tags.slice(0);
              console.log("oldTagArr", oldTagArr);
              let newTagArr = oldTagArr.slice(0);
              newTagArr.splice(index, 1);
              console.log("newTagArr", newTagArr);
              that.props.grandParent.setState({ tags: newTagArr });
            }}
          />
        </span>
      );
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
        <span>input tags: </span>
          <input
            type="text"
            onChange={this.handleInputTag}
            name="tag"
            value={this.props.grandParent.state.inputTag}
          />
          <div style={{ maxWidth: "500px", margin: "auto" }}>
            {this.displayTags()}
          </div>
        </form>
      </div>
    );
  }
}

class ListPropertiesForm extends Component {
  constructor(props) {
    super(props);

    this.inputTextHandler = this.inputTextHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  inputTextHandler(e) {
    if (e.target.name === "listName") {
      this.props.parent.setState({ inputTitle: e.currentTarget.value });
    } else if (e.target.name === "description") {
      this.props.parent.setState({ inputDescription: e.currentTarget.value });
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    if (e.target[0].name === "tag") {
    } else if (this.props.parent.state.inputTitle.length !== 0) {
      this.props.parent.setState({ modalIsOpen: true });
    } else {
      this.props.parent.setState({ message: "List title may not be empty" });
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <span>List Name:</span>
          <input
            type="text"
            placeholder="List Name"
            name="listName"
            onChange={this.inputTextHandler}
          />
          <br></br>
          <TagsBody grandParent={this.props.parent} />
        </div>
        <div>
          <h4>Description</h4>
          <textarea
            name="description"
            cols="40"
            rows="5"
            onChange={this.inputTextHandler}
          />
        </div>
        <input type="submit" />
      </form>
    );
  }
}

class UnconnectedMakeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputTitle: "",
      inputDescription: "",
      inputTag: "",
      tags: [],
      message: "",
      confirmedFinishedList: false,
      modalIsOpen: false
    };
    this.displayMessage = this.displayMessage.bind(this);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.addList = this.addList.bind(this);
  }
  openModal() {
    this.setState({ modalIsOpen: true });
  }
  afterOpenModal() {
    // this.subtitle.style.color="#f00"
  }
  closeModal() {
    this.setState({ modalIsOpen: false });
  }
  displayMessage() {
    if (this.state.message) {
      return (
        <div className="jump" style={{ color: "red" }}>
          {this.state.message}
        </div>
      );
    }
  }
  addList() {
    let that = this;
    //tags will be sent as a string which separates the movies with ^^ .
    let tagBody=this.state.tags.join(" ^^ ")
    let reqBody = {
      name: this.state.inputTitle,
      movieArr: ["movie1", "movie2", "movie3"],
      description: this.state.inputDescription,
      tags: tagBody
    };
    console.log("commencing fetch at endpoint /lists/add ");
    axios({
      method: "post",
      url: "/lists/add",
      data: reqBody,
      withCredentials: "include"
    }).then(response => {
      console.log("response", response);
      if (response.data.success) {
        console.log("successful request")
        that.setState({ confirmedFinishedList: true });
        that.props.history.push("/")
      }else{
        console.log("error in request")
      }
    });
  }

  render() {
    if (!this.props.loggedIn) {
      return <Redirect to="/loginalert" />;
    } else {
      return (
        <div>
          <h2>Make A List</h2>
          {this.displayMessage()}
          <ListPropertiesForm parent={this} />
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={ModalStyles}
          >
            <h5>Confirm to finish making List</h5>
            <button onClick={this.addList}>Confirm</button>
            <button onClick={() => this.setState({ modalIsOpen: false })}>
              Not yet
            </button>
          </Modal>
        </div>
      );
    }
  }
}

let mapStateToProps = function(state) {
  return { loggedIn: state.state.loggedIn };
};

let MakeList = connect(mapStateToProps)(withRouter(UnconnectedMakeList));

export default MakeList;
