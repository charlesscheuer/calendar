import React, { Component } from "react";
import moment from "moment";

import Connected from "./Connected";
import Onboarding from "./Onboarding";
import Spinner from "./Spinner";

import "./App.scss";

/*global chrome*/

class App extends Component {
  constructor() {
    super();
    this.state = {
      todaysEvents: [],
      tomorrowsEvents: [],
      calendars: null,
      events: null,
      uuid: null,
      loaded: null,
    };
  }

  componentWillMount = () => {
    chrome.storage &&
      chrome.storage.sync.get(["events"], (result) => {
        if (Object.keys(result).length !== 0) {
          const useThis = result["events"];
          console.log(useThis, "u suck jackass");
          useThis.forEach((event) => {
            if (this.isToday(event.start)) {
              const newTodays = [...this.state.todaysEvents, event];
              this.setState({ todaysEvents: newTodays });
            } else if (this.isTomorrow(event.start)) {
              const newTomorrows = [...this.state.todaysEvents, event];
              this.setState({ tomorrowsEvents: newTomorrows });
            }
          });
        }
      });

    chrome.storage &&
      chrome.storage.sync.get(["uuid"], (result) => {
        if (Object.keys(result).length !== 0)
          this.setState({ uuid: result["uuid"] });
      });

    chrome.storage &&
      chrome.storage.sync.get(["calendars"], (result) => {
        if (Object.keys(result).length !== 0)
          this.setState({ calendars: result["calendars"] });
      });
    this.setState({ loaded: true });
  };

  isToday = (datetime) => {
    var dateObj = new Date(datetime);
    var momentObj = moment(dateObj);
    return momentObj.isSame(new Date(), "day");
  };

  isTomorrow = (datetime) => {
    var dateObj = new Date(datetime);
    var momentObj = moment(dateObj);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return momentObj.isSame(tomorrow, "day");
  };

  setUuid = (uuid) => {
    this.setState({ uuid: uuid });
  };

  setCalendars = (calendars) => {
    this.setState({ calendars: calendars });
  };

  setEvents = (events) => {
    this.setState({ events: events });
  };

  render() {
    const { loaded, uuid, todaysEvents, tomorrowsEvents } = this.state;
    console.log(todaysEvents);
    return loaded ? (
      uuid !== null ? (
        <Connected
          todaysEvents={todaysEvents}
          tomorrowsEvents={tomorrowsEvents}
        />
      ) : (
        <Onboarding
          setUuid={this.setUuid}
          setCalendars={this.setCalendars}
          setEvents={this.setEvents}
        />
      )
    ) : (
      <Spinner />
    );
  }
}
export default App;
