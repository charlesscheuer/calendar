import React, { Component } from "react";
import Connected from "./Connected";
import Onboarding from "./Onboarding";
import "./App.scss";

class App extends Component {
  constructor() {
    super();
    this.state = {
      connected: false,
    };
  }

  connectCalendar = () => {
    this.setState({ connected: true });
  };

  render() {
    const { connected } = this.state;
    return connected ? (
      <Connected />
    ) : (
      <Onboarding auth={this.connectCalendar} />
    );
  }
}

export default App;
