import React, { Component } from "react";

import Connected from "./Connected";
import Onboarding from "./Onboarding";

import "./App.scss";

const backend_url =
  "https://us-central1-calendar-276823.cloudfunctions.net/nextcallfyi/";

/*global chrome*/

class App extends Component {
  constructor() {
    super();
    this.state = {
      uuid: null,
      addNewCalendar: false,
      numCalendars: 0,
    };
  }

  getUuid = () => {
    return (
      chrome.storage &&
      chrome.storage.local.get(["uuid"], (result) => {
        if (Object.keys(result).length !== 0) {
          this.setState({ uuid: result["uuid"] });
        }
      })
    );
  };

  componentWillMount = () => {
    this.getUuid();
  };

  addNewCalendar = (calendars) => {
    console.log("reached add new");
    console.log(calendars, "FROM ADDNEWCALS FUNCTiONS");
    console.log(calendars.length)
    this.setState({
      addNewCalendar: true,
      numCalendars: calendars.length,
    });
  };

  // make notifications

  renderProperView = () => {
    const { uuid, addNewCalendar, numCalendars } = this.state;
    if (uuid && !addNewCalendar) {
      return (
        <Connected
          addNewCalendar={this.addNewCalendar}
          stopAdd={() => this.setState({ addNewCalendar: false })}
          uuid={uuid}
        />
      );
    }
    return (
      <Onboarding
        addNewCalendar={addNewCalendar}
        numCalendars={numCalendars}
        stopAdd={() => this.setState({ addNewCalendar: false })}
      />
    );
  };

  render() {
    return this.renderProperView();
  }
}
export default App;
