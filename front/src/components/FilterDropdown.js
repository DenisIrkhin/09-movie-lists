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
    this.state={showMenu:true,inputSearch:"",checkedListsIds:[]}
    this.RenderMenu=this.RenderMenu.bind(this)
    this.handleInputSearch=this.handleInputSearch.bind(this)
    this.handleCheck=this.handleCheck.bind(this)
    this.openMenu=this.openMenu.bind(this)
    this.closeMenu=this.closeMenu.bind(this)
  }

  openMenu(){this.setState({showMenu:true})}
  closeMenu(){this.setState({showMenu:false})}

  handleInputSearch(evt){
      this.setState({inputSearch:evt.target.value})
  }

  handleCheck(evt){
    console.log('evt', evt)
    let listId=evt.currentTarget.name
    if(evt.currentTarget.checked){
        let newArr=this.state.checkedListsIds.slice(0)
        console.log("checkedListId before",newArr)
        newArr.push(listId)
        console.log("checkedListId after",newArr)
        this.setState({checkedListsIds:newArr})
    }else{
        let arr=this.state.checkedListsIds.slice(0)
        console.log("checkedListId before",arr)
        let index=arr.indexOf(listId);
        arr.splice(index,1)
        console.log("checkedListId after",arr)
        this.setState({checkedListsIds:arr})

    }
    
  }
  //add movie to each of the following checked lists //TODO
  // reqbody={lists:[listId1,listId2,listId3,list4],movieObject:movieObject]
  handleAddToList(){
    axios({
        post:"",
        url:"",
        data:"",
        withCredentials:true
    })
  }
  //renders menu with filter
  RenderMenu(){
    let listArr=this.props.lists
    console.log('listArr', listArr)
   
    let filterMenu=(elem)=>{
        
        return elem.name.includes(this.state.inputSearch)
    }
    let filteredMenu=listArr.filter(filterMenu)
    console.log('filteredMenu', filteredMenu)
    let makeMenuOptions=(elem)=>{
        let checked=false
        if(this.state.checkedListsIds.includes(elem._id)){
            checked=true
        }
        return(
            <li>
                <input onChange={this.handleCheck} name={elem._id} type="checkbox" checked={checked}></input><span>{elem.name}</span>
            </li>
        )
    }
    let mappedMenuOptions=filteredMenu.map(makeMenuOptions)
    
    
    return(
        <div>
            <input type="search" name="search" onChange={this.handleInputSearch} placeholder="Search Your Lists"></input>
            <input type="button" name="addToListButton" value="Add To List"></input>
            <ol>
                {mappedMenuOptions}
            </ol>
        </div>
    )
  }

    

  render() {
    if(this.state.showMenu){
        document.addEventListener("click",()=>{this.closeMenu()})
        return <div style={{width:"150px",maxeight:"300px",overflowY:"scroll",border:"2px solid"}}>
       {this.RenderMenu()}
    </div>
    }else{
        return <div></div>
    }
    
  }
}

let mapStateToProps = function(state) {
  return { loggedIn: state.state.loggedIn, lists: state.state.lists };
};

let FilterDropdown = connect(mapStateToProps)(UnconnectedFilterDropdown);

export default FilterDropdown;
