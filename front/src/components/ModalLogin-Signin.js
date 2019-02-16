import React, { Component } from "react";
import "../css/style.css";
import App from "../App.js"
import Modal from "react-modal"


class ModalLoginSignup extends Component{
    render(){
        return(
            <div >

        <Modal isOpen={this.props.state.modalIsOpen} onAfterOpen={this.props.afterOpenModal} onRequestClose={this.closeModal} style={customStyles}>
        <h3>Log in </h3>
        <form onSubmit={this.handleSubmit}>
          <div>
            <input
              type="text"
              onChange={this.handleInputEmail}
              value={this.state.inputEmail}
            />
            <div>Email</div>
          </div>
          <div>
            <input
              type="text"
              onChange={this.handleInputPassword}
              value={this.state.inputPassword}
            />
            <div>Password</div>
          </div>
          <input type="submit" />
        </form>
        </Modal>
      </div>
        )
    }
}