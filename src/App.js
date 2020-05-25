import React, { Component } from "react";
import moment from "moment";

import Connected from "./Connected";
import Onboarding from "./Onboarding";
import Spinner from "./Spinner";

import "./App.scss";
import ConfigureCalendars from "./ConfigureCalendars";

const backend_url =
  "https://us-central1-calendar-276823.cloudfunctions.net/nextcallfyi/";

/*global chrome*/

class App extends Component {
  constructor() {
    super();
    this.state = {
      calendars: this.getCalendars(),
      events: this.getEvents(),
      configureCalendars: false,
      uuid: this.getUuid(),
      loaded: true,
    };
  }

  getEvents = () => {
    let events = {
      todays: [],
      tomorrows: [],
    };
    chrome.storage &&
      chrome.storage.sync.get(["events"], (result) => {
        if (Object.keys(result) && Object.keys(result).length !== 0) {
          console.log("reached inner get events");
          result["events"].forEach((event) => {
            if (this.isToday(event.start)) {
              events.todays = [...events.todays, event];
            } else if (this.isTomorrow(event.start)) {
              events.tomorrows = [...events.tomorrows, event];
            }
          });
          return events;
        } else {
          return null;
        }
      });
  };

  getUuid = () => {
    chrome.storage &&
      chrome.storage.sync.get(["uuid"], (result) => {
        if (Object.keys(result) && Object.keys(result).length !== 0)
          return result["uuid"];
        return null;
      });
  };

  getCalendars = () => {
    chrome.storage &&
      chrome.storage.sync.get(["calendars"], (result) => {
        if (result["calendars"] && result["calendars"].length > 0)
          return result["calendars"];
        return null;
      });
  };

  isToday = (datetime) => {
    var dateObj = new Date(datetime);
    var momentObj = moment(dateObj);
    return momentObj.isSame(new Date(), "day") && momentObj.isAfter();
  };

  isTomorrow = (datetime) => {
    var dateObj = new Date(datetime);
    var momentObj = moment(dateObj);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return momentObj.isSame(tomorrow, "day");
  };

  delete = (id) => {
    const { uuid } = this.state;
    let body = {
      cal_id: id,
      disconnect: true,
    };
    var api = backend_url + `calendars/${uuid}`;
    fetch(api, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(function (response) {
      chrome.storage && chrome.storage.sync.clear();
      return response.json();
    });
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

  // make notifications

  renderProperView = () => {
    const { loaded, uuid, events, configureCalendars, calendars } = this.state;
    console.log(calendars, "CALENDARS FROM STATE");
    if (this.getUuid() !== null) {
      if (configureCalendars) {
        return (
          <ConfigureCalendars
            calendars={calendars}
            delete={this.delete}
            configureCalendars={() =>
              this.setState({ configureCalendars: false })
            }
          />
        );
      } else {
        return (
          <Connected
            todaysEvents={events && events.todays}
            configureCalendars={() => {
              this.setState({ configureCalendars: true });
            }}
            tomorrowsEvents={events && events.tomorrows}
          />
        );
      }
    } else {
      return (
        <Onboarding
          setUuid={this.setUuid}
          setCalendars={this.setCalendars}
          setEvents={this.setEvents}
        />
      );
    }
  };

  render() {
    return this.renderProperView();
  }
}
export default App;
