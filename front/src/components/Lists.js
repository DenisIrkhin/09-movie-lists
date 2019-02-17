import React, { Component } from "react";
import "../css/style.css";
import { Redirect, Link } from "react-router-dom";
import "../css/LoginSignup.css";
import { connect } from "react-redux";
import axios from "axios";
import App from "../App.js";
import Modal from "react-modal";

class UnconnectedLists extends Component{
    constructor(props){
        super(props)
        
    }
    componentDidMount(){
        axios({
            method:"get",
            url:"http://localhost:5050/lists",
            withCredentials:true
        }).then((response)=>{
            console.log(response)
            this.props.dispatch({type:"getLists"})
        })
    }

    render(){
        return(
            <div>
                <h2>Your Lists</h2>

            </div>
        )
    }
}

let mapStateToProps=function(state){
    return {lists:state.state.lists}
}
let Lists=connect(mapStateToProps)(UnconnectedLists)

export default Lists