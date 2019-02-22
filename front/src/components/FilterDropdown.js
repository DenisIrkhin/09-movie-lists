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

class UnconnectedFilterDropdown extends Component{
    constructor(props){
        super(props)
    }


}




let mapStateToProps=function(state){
    return ({loggedIn:state.state.loggedIn,lists:state.state.})
}

let FilterDropdown=connect()(UnconnectedFilterDropdown)

export default FilterDropdown