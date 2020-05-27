import React, { Component } from "react";

import { isToday, isTomorrow } from "./MomentHelpers";

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
      loaded: true,
      addNewCalendar: false,
    };
  }

  componentWillMount = () => {
    this.getUuid();
    this.fetchLatestEvents();
    // chrome.storage &&
    //   chrome.storage.sync.get(["calendars"], (result) => {
    //     if (Object.keys(result).length !== 0)
    //       this.setState({ calendars: result["calendars"] });
    //   });
  };

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

  fetchLatestEvents = () => {
    const { uuid } = this.state;
    var api = backend_url + `refresh/events/${uuid}`;
    const that = this;
    if (uuid !== null) {
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
            var todays = [];
            var tomorrows = [];
            data.forEach((calendar) => {
              // data is an array of objects
              // each object is named like gcal-1
              // we want all the elements of that pushed to events
              // calendar is an object
              calendar[Object.keys(calendar)[0]].forEach((event) => {
                if (isToday(event.start)) {
                  todays = [...todays, event];
                } else if (isTomorrow(event.start)) {
                  tomorrows = [...tomorrows, event];
                }
              });
            });
            that.setState({ tomorrowsEvents: tomorrows, todaysEvents: todays });
          }
        });
    }
  };

  // disconnect a calendar
  delete = (id) => {
    const { uuid, calendars } = this.state;
    const newCalendarsArray = calendars.filter((calendar) => {
      return calendar.id !== id;
    });
    this.setState({ calendars: newCalendarsArray });
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

  getCalendars() {
    const { uuid } = this.state;
    const that = this;
    var api = backend_url + `calendars/${uuid}`;
    return fetch(api, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        let calendars = [];
        Object.keys(data).forEach((calendarID) => {
          if (data[calendarID].email) {
            const newItem = { ...data[calendarID], id: calendarID };
            calendars.push(newItem);
          }
        });
        that.setState({ calendars });
      });
  }

  // make notifications

  renderProperView = () => {
    const {
      loaded,
      uuid,
      todaysEvents,
      tomorrowsEvents,
      configureCalendars,
      addNewCalendar,
      calendars,
    } = this.state;
    if (loaded && uuid !== null && !addNewCalendar) {
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
          addNewCalendar={this.state.addNewCalendar}
          stopAdd={() => this.stopAdd()}
          setUuid={(uuid) => this.setState({ uuid })}
        />
      );
    } else {
      return <Spinner />;
    }
  };

  componentDidMount() {
    setInterval(() => this.getCalendars(), 500);
    setInterval(() => this.fetchLatestEvents(), 500);
  }

  render() {
    // console.log(this.state.calendars);
    return this.renderProperView();
  }
}
export default App;
