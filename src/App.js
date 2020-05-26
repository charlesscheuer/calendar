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
      addNewCalendar: false,
    };
  }

  getEvents() {
    let events = {
      today: [],
      tomorrow: [],
    };
    chrome.storage &&
      chrome.storage.sync.get(["events"], (result) => {
        if (Object.keys(result).length !== 0) {
          result["events"].forEach((event) => {
            if (this.isToday(event.start)) {
              events.today = [...events.today, event];
            } else if (this.isTomorrow(event.start)) {
              events.tomorrow = [...events.tomorrow, event];
            }
          });
          console.log(events, "FROM GETEVENTS");
        }
      });
    return events;
  }

  componentWillMount = () => {
    this.getCalendars();
  };

  getUuid() {
    chrome.storage &&
      chrome.storage.sync.get(["uuid"], (result) => {
        if (Object.keys(result).length !== 0) return result["uuid"];
      });
  }

  getCalendars() {
    return (
      chrome.storage &&
      chrome.storage.sync.get(["calendars"], (result) => {
        console.log(result["calendars"]);
        if (result["calendars"].length > 0) return result["calendars"];
      })
    );
  }

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

  stopAdd = () => {
    this.setState({ addNewCalendar: false });
  };

  renderProperView = () => {
    const {
      loaded,
      uuid,
      events,
      configureCalendars,
      calendars,
      addNewCalendar,
    } = this.state;
    if (loaded && (uuid !== null || uuid !== undefined) && !addNewCalendar) {
      if (configureCalendars) {
        return (
          <ConfigureCalendars
            calendars={calendars}
            delete={this.delete}
            addNewCalendar={() => this.setState({ addNewCalendar: true })}
            configureCalendars={() =>
              this.setState({ configureCalendars: false })
            }
          />
        );
      } else {
        return (
          <Connected
            events={this.getEvents()}
            configureCalendars={() => {
              this.setState({ configureCalendars: true });
            }}
          />
        );
      }
    } else if (loaded) {
      return (
        <Onboarding
          setUuid={this.setUuid}
          setCalendars={this.setCalendars}
          setEvents={this.setEvents}
          stopAdd={() => this.stopAdd()}
          addNewCalendar={addNewCalendar}
        />
      );
    } else {
      return <Spinner />;
    }
  };

  render() {
    console.log(this.getCalendars(), "CALENDARS");
    return this.renderProperView();
  }
}
export default App;
