import React, { Component } from "react";
import "../css/style.css";
import { Redirect, Link } from "react-router-dom";
import { withRouter } from "react-router";

import "../css/MakeList.css";
import { connect } from "react-redux";
import axios from "axios";
import App from "../App.js";
import Modal from "react-modal";
import MovieSearchBody from "./MakeListSearchMovie";
import {FacebookShareButton,TwitterShareButton} from 'react-share'


class TagSearchResults extends Component{
    constructor(props){
        super(props)
        this.state={filteredLists:[],allLists:[]}
        this.displayLists=this.displayLists.bind(this)
        this.displayTags=this.displayTags.bind(this)
        this.startTagSearch=this.startTagSearch.bind(this)
        this.filterList=this.filterList.bind(this)
    }
    startTagSearch(){
        console.log("started tag search")
        let that=this
        console.log("fetching lists/wildsearch with no query")
        axios({
            method: "post",
            url: "/api/lists/wildsearch",
            data: {search:""}
          }).then(response => {
            console.log("response", response);
            let allLists=response.data.sortedRankedLists
            console.log('allLists', allLists)
            if(this.props.tag===this.state.tag){
                return
            }
           
            that.setState({tag:this.props.tag,allLists:allLists})

            let filterByTag=(elem)=>{
                if(elem.tags.split(" ^^ ").includes(this.props.tag)){
                    console.log("list that passed filter",this.props.tag,"is",elem)
                    return true
                }
                return false
            }
            let filteredLists=allLists.filter(filterByTag)
            console.log('filteredLists', filteredLists)
            if(filteredLists===that.state.filteredLists){
                return
            }
            that.setState({filteredLists:filteredLists})
          })
    }
    filterList(){
        let that=this
        let filterByTag=(elem)=>{
            if(elem.tags.split(" ^^ ").includes(this.props.tag)){
                console.log("list that passed filter",this.props.tag,"is",elem)
                return true
            }
            return false
        }
        let filteredLists=this.state.allLists.filter(filterByTag)
        console.log('filteredLists', filteredLists)
        
        that.setState({filteredLists:filteredLists})
    }


    displayTags(tagList) {
        let that = this;
        return tagList.split(" ^^ ").map((elem, index) => {
          return (
              <Link to={"/searchtags/"+elem}>
            <span className>
              {elem}
              <span
                name={index}
                className="fas fa-tag"
                
              />
            </span>
            </Link>
          );
        });
      }

    displayLists(){
        let elemToDOM=(elem)=>{
            return(
                <div>
                    <li>
                        <Link to={"/lists/"+elem._id}><h5>{elem.name}</h5></Link>
                        <FacebookShareButton url={window.location.origin+"/lists/"+elem._id} className={"fab fa-facebook"}></FacebookShareButton>
              <TwitterShareButton url={window.location.origin+"/lists/"+elem._id} className={"fab fa-twitter-square"}></TwitterShareButton>
                        <div>{elem.description}</div>
                        <div>{this.displayTags(elem.tags)}</div>
                    </li>
                </div>
            )
        }
        let mappedLists=this.state.filteredLists.map(elemToDOM)
        return mappedLists
    }

    render(){
        console.log("rendered tagsearchresults component")
       this.startTagSearch()
        return(
            <div >
                <h3>Lists with Tag: {this.props.tag}</h3>
                <ol>
                {this.displayLists()}
                </ol>
            </div>
        )
    }
}


export default TagSearchResults