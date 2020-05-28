import React, { Component } from "react";

import Connected from "./Connected";
import Onboarding from "./Onboarding";
import Spinner from "./Spinner";

import "./App.scss";

/*global chrome*/

class App extends Component {
  constructor() {
    super();
    this.state = {
      uuid: null,
      loaded: true,
      addNew: false,
    };
  }

  getUuid = () => {
    return (
      chrome.storage &&
      chrome.storage.sync.get(["uuid"], (result) => {
        if (Object.keys(result).length !== 0) {
          this.setState({ uuid: result["uuid"] });
          return result["uuid"];
        }
      })
    );
  };

  stopAdd = () => {
    this.setState({ addNewCalendar: false });
  };

  componentWillMount = () => {
    this.getUuid();
  };

  // make notifications

  renderProperView = () => {
    const { loaded, uuid, addNewCalendar } = this.state;
    if (loaded && uuid !== null && !addNewCalendar) {
      return (
        <Connected
          addNewCalendar={() => this.setState({ addNewCalendar: true })}
          stopAdd={this.stopAdd}
          uuid={uuid}
        />
      );
    }
    return (
      <Onboarding
        addNewCalendar={this.state.addNewCalendar}
        stopAdd={() => this.stopAdd()}
        setUuid={(uuid) => this.setState({ uuid })}
      />
    );
  };

  render() {
    return this.renderProperView();
  }
}
export default App;
