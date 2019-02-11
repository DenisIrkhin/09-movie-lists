import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Logo from "./components/Logo.js";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Logo />
      </div>
    );
  }
}

export default App;
