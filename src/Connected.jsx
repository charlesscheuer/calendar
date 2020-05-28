import React, { Component } from "react";
import moment from "moment";

import ConfigureCalendars from "./ConfigureCalendars";
import Events from "./Events";

import { isToday, isTomorrow } from "./MomentHelpers";

import "./App.scss";

const backend_url =
  "https://us-central1-calendar-276823.cloudfunctions.net/nextcallfyi/";

/*global chrome*/

export default class Connected extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todaysEvents: [],
      tomorrowsEvents: [],
      calendars: null,
      events: null,
      slowDelay: false,
      configureCalendars: false,
    };
  }

  fetchLatestEvents = (delay) => {
    const { uuid } = this.props;
    var api = backend_url + `refresh/events/${uuid}`;
    const that = this;
    console.log(delay, "was delay");
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
              chrome.storage.sync.set({ loaded: true }, function () {});
              calendar[Object.keys(calendar)[0]].forEach((event) => {
                if (
                  isToday(event.start) &&
                  !moment().isAfter(moment(event.start).add(30, "m"))
                ) {
                  todays = [...todays, event];
                } else if (isTomorrow(event.start)) {
                  tomorrows = [...tomorrows, event];
                }
              });
            });
            console.log(that.state, todays, tomorrows);
            if (that.state.tomorrowsEvents !== tomorrows) {
              that.setState({
                tomorrowsEvents: tomorrows,
              });
            } else if (that.state.todaysEvents !== todays) {
              that.setState({
                todaysEvents: todays,
              });
            }
          }
        });
    }
  };

  // disconnect a calendar
  delete = (id) => {
    const { calendars } = this.state;
    const { uuid } = this.props;
    const newCalendarsArray = calendars.filter((calendar) => {
      return calendar.id !== id;
    });
    console.log(newCalendarsArray);
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
    const { uuid } = this.props;
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

  componentWillMount = () => {
    this.fetchLatestEvents();
  };

  componentDidMount() {
    let delay = 500;
    chrome.storage &&
      chrome.storage.sync.get(["loaded"], (result) => {
        console.log(result["loaded"], "RESULT LOOKING FOR LOADED");
        if (Object.keys(result).length !== 0) {
          delay = 30000;
        }
      });
    setInterval(() => this.getCalendars(), delay);
    setInterval(() => this.fetchLatestEvents(delay), delay);
  }

  renderProper = () => {
    const {
      configureCalendars,
      calendars,
      todaysEvents,
      tomorrowsEvents,
    } = this.state;
    if (configureCalendars) {
      return (
        <ConfigureCalendars
          calendars={calendars}
          delete={this.delete}
          addNewCalendar={this.props.addNewCalendar}
          configureCalendars={() =>
            this.setState({ configureCalendars: false })
          }
        />
      );
    } else {
      return (
        <Events
          todaysEvents={todaysEvents}
          configureCalendars={() => {
            this.setState({ configureCalendars: true });
          }}
          tomorrowsEvents={tomorrowsEvents}
        />
      );
    }
  };

  render() {
    return this.renderProper();
  }
}
