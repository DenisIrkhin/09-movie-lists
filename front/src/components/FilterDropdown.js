import React, { Component } from "react";
import "../css/style.css";
import { Redirect, Link } from "react-router-dom";
import "../css/LoginSignup.css";
import { connect } from "react-redux";
import axios from "axios";
import App from "../App.js";
import { withRouter } from "react-router";
import Modal from "react-modal";
import { isThisQuarter } from "date-fns";
import "../css/FilterDropdown.css";

class UnconnectedFilterDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: true,
      inputSearch: "",
      movie:this.props.movie,
      checkedListsIds: [],
      xPos: this.props.xPos,
      yPos: this.props.yPos
    };
    this.RenderMenu = this.RenderMenu.bind(this);
    this.handleInputSearch = this.handleInputSearch.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    // this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.handleAddToList=this.handleAddToList.bind(this)
  }

  componentDidMount(){
    console.log("Filter xPos",this.state.xPos)
    console.log("Filter yPos",this.state.yPos)
  }
  // openMenu(evt) {
  //   this.setState({ showMenu: true, xPos: evt.clientX, yPos: evt.clientY });
  // }
  closeMenu() {
    this.setState({ showMenu: false })
    this.props.parent.setState({addingToList:false});
  }

  handleInputSearch(evt) {
    this.setState({ inputSearch: evt.target.value });
  }

  handleCheck(evt) {
    console.log("evt", evt);
    let listId = evt.currentTarget.name;
    if (evt.currentTarget.checked) {
      let newArr = this.state.checkedListsIds.slice(0);
      // console.log("checkedListId before", newArr);
      newArr.push(listId);
      // console.log("checkedListId after", newArr);
      this.setState({ checkedListsIds: newArr });
    } else {
      let arr = this.state.checkedListsIds.slice(0);
      // console.log("checkedListId before", arr);
      let index = arr.indexOf(listId);
      arr.splice(index, 1);
      // console.log("checkedListId after", arr);
      this.setState({ checkedListsIds: arr });
    }
  }
  //add movie to each of the following checked lists //TODO
  // reqbody={lists:[listId1,listId2,listId3,list4],movieObject:movieObject]
  handleAddToList() {
    console.log("added movie to lists")
    let that=this
    axios({
      method: "put",
      url: "/api/lists/add-movie/",
      data: {movieObject:this.props.movie,lists:this.state.checkedListsIds},
      withCredentials: true
    }).then((response)=>{
      this.closeMenu()
    })
    
  }
  //renders menu with filter
  RenderMenu() {
    let listArr = this.props.lists;
    // console.log("listArr", listArr);

    let filterMenu = elem => {
      return elem.name.includes(this.state.inputSearch);
    };
    let filteredMenu = listArr.filter(filterMenu);
    // console.log("filteredMenu", filteredMenu);
    let makeMenuOptions = elem => {
      let checked = false;
      if (this.state.checkedListsIds.includes(elem._id)) {
        checked = true;
      }
      return (
        <li>
          <input
            onChange={this.handleCheck}
            name={elem._id}
            type="checkbox"
            checked={checked}
          />
          <span>{elem.name}</span>
        </li>
      );
    };
    let mappedMenuOptions = filteredMenu.map(makeMenuOptions);

    return (
      <div
        style={{
          position: "absolute",
          top: this.state.yPos+window.scrollY,
          left: this.state.xPos+window.scrollX,
          width: "150px",
          maxeight: "300px",
          overflowY: "scroll",
          border: "2px solid",
          background:"white"
        }}
        onClick={evt => {
          evt.stopPropagation();
        }}
      >
        <input
          type="search"
          name="search"
          onChange={this.handleInputSearch}
          placeholder="Search Your Lists"
        />
        <input type="button" name="addToListButton" onClick={this.handleAddToList} value="Add To List" />
        <ol>{mappedMenuOptions}</ol>
      </div>
    );
  }

  render() {
    if (this.state.showMenu) {
      return (
        <div>
          <div
            className="transparent"
            style={{
              position: "absolute",
              backgroundColor: "rgba(0,0,0,0)",
              width: document.body.scrollWidth,
              height: document.body.scrollHeight,
              zIndex: "10000000000",
              top:"0px"
              
            }}
            onClick={evt => {
              this.closeMenu(evt);
            }}
          >
            {this.RenderMenu()}
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

let mapStateToProps = function(state) {
  return { loggedIn: state.state.loggedIn, lists: state.state.lists };
};

let FilterDropdown = connect(mapStateToProps)(UnconnectedFilterDropdown);

export default FilterDropdown;
