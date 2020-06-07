import React, { Component } from "react";

import Connected from "./Connected";
import Onboarding from "./Onboarding";

import "./App.scss";

/*global chrome*/

class App extends Component {
  constructor() {
    super();
    this.state = {
      uuid: null,
      addNewCalendar: false,
    };
  }

  getUuid = () => {
    return (
      chrome.storage &&
      chrome.storage.sync.get(["uuid"], (result) => {
        if (Object.keys(result).length !== 0) {
          this.setState({ uuid: result["uuid"] });
        }
      })
    );
  };

  componentWillMount = () => {
    this.getUuid();
  };

  // make notifications

  renderProperView = () => {
    const { uuid, addNewCalendar } = this.state;
    if (uuid && !addNewCalendar) {
      return (
        <Connected
          addNewCalendar={() => this.setState({ addNewCalendar: true })}
          stopAdd={() => this.setState({ addNewCalendar: false })}
          uuid={uuid}
        />
      );
    }
    return (
      <Onboarding
        addNewCalendar={this.state.addNewCalendar}
        stopAdd={() => this.setState({ addNewCalendar: false })}
      />
    );
  };

  render() {
    return this.renderProperView();
  }
}
export default App;
