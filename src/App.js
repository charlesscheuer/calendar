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
          const useThis = result["events"];
          useThis[0].forEach((event) => {
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
        if (Object.keys(result).length !== 0)
          this.setState({ calendars: result["calendars"] });
      });
    this.setState({ loaded: true });
  };

  initPolling() {
    var delay = 999999999;
    console.log("reached init poling");
    chrome.storage &&
      chrome.storage.sync.get(["delay"], (result) => {
        if (result["delay"]) delay = result["delay"];
        this.timer = setInterval(() => this.pollStatus(), delay);
      });
  }

  // Poll for connection status
  pollStatus = () => {
    console.log("polling...");
    chrome.storage &&
      chrome.storage.sync.get(["connected"], async (result) => {
        if (result["connected"]) await this.fetchLatestEvents(this.state.uuid);
      });
  };

  fetchLatestEvents = (uuid) => {
    var api = backend_url + `refresh/events/${uuid}`;
    const that = this;
    fetch(api, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.length !== 0) {
          console.log("refreshing events...");
          let events = [];
          data.forEach((calendar) => {
            // data is an array of objects
            // each object is named like gcal-1
            // we want all the elements of that pushed to events
            events.push(calendar[Object.keys(calendar)[0]]);
          });
          that.setState({ events });
          console.log("events", events); // isn't reaching here yet
          chrome.storage.sync.set({ events }, function () {});
        }
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
              console.log("reached me");
              this.setState({ configureCalendars: true });
            }}
            tomorrowsEvents={tomorrowsEvents}
          />
        );
      }
    } else if (loaded) {
      return <Onboarding setUuid={(uuid) => this.setState({ uuid })} />;
    } else {
      return <Spinner />;
    }
  };

  componentDidMount() {
    this.initPolling();
  }

  render() {
    return this.renderProperView();
  }
}
export default App;
