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
      todaysEvents: [],
      tomorrowsEvents: [],
      calendars: null,
      events: null,
      configureCalendars: false,
      uuid: null,
      loaded: null,
    };
  }

  componentWillMount = () => {
    var todays = [];
    var tomorrows = [];
    chrome.storage &&
      chrome.storage.sync.get(["events"], (result) => {
        if (Object.keys(result).length !== 0) {
          result["events"].forEach((event) => {
            if (this.isToday(event.start)) {
              todays = [...todays, event];
            } else if (this.isTomorrow(event.start)) {
              tomorrows = [...tomorrows, event];
            }
          });
          this.setState({ todaysEvents: todays });
          this.setState({ tomorrowsEvents: tomorrows });
        }
      });

    chrome.storage &&
      chrome.storage.sync.get(["uuid"], (result) => {
        if (Object.keys(result).length !== 0)
          this.setState({ uuid: result["uuid"] });
      });

    chrome.storage &&
      chrome.storage.sync.get(["calendars"], (result) => {
        if (result["calendars"].length > 0)
          this.setState({ calendars: result["calendars"] });
      });
    this.setState({ loaded: true });
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
    console.log("reached delete function");
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
      console.log("RESPONSE in delete: ", response);
      chrome.storage &&
        chrome.storage.sync.get(["calendars"], (result) => {
          delete result.calendars[id];
          console.log(result.calendars, "DELETED: ");
          chrome.storage.sync.set({ calendars: result }, function () {
            console.log(result, "FROM CALLBACK");
          });
        });
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
    const {
      loaded,
      uuid,
      todaysEvents,
      tomorrowsEvents,
      configureCalendars,
      calendars,
    } = this.state;
    if (loaded && uuid !== null) {
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
            todaysEvents={todaysEvents}
            configureCalendars={() => {
              this.setState({ configureCalendars: true });
            }}
            tomorrowsEvents={tomorrowsEvents}
          />
        );
      }
    } else if (loaded) {
      return (
        <Onboarding
          setUuid={this.setUuid}
          setCalendars={this.setCalendars}
          setEvents={this.setEvents}
        />
      );
    } else {
      return <Spinner />;
    }
  };

  render() {
    return this.renderProperView();
  }
}
export default App;
