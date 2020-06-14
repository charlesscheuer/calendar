import React, { Component } from "react";
import moment from "moment";

import ConfigureCalendars from "./ConfigureCalendars";
import Events from "./Events";
import Spinner from "./Spinner";

import { isToday, isTomorrow } from "./MomentHelpers";

import "./App.scss";

const backend_url =
  "https://us-central1-calendar-276823.cloudfunctions.net/nextcallfyi/";

/*global chrome*/

export default class Connected extends Component {
  intervalId = 0;
  constructor(props) {
    super(props);
    this.state = {
      todaysEvents: [],
      tomorrowsEvents: [],
      calendars: null,
      events: null,
      loading: true,
      configureCalendars: false,
    };
  }

  fetchLatestEvents = () => {
    const { uuid } = this.props;
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
          if (data.length === 0) {
            chrome.storage.local.set({ todaysEvents: [] }, function () {});
            chrome.storage.local.set({ tomorrowsEvents: [] }, function () {
              that.setState({ todaysEvents: [], tomorrowsEvents: [] });
            });
          }
          if (data.length !== 0 && data) {
            var todays = [];
            var tomorrows = [];
            data.forEach((calendar) => {
              // data is an array of objects
              // each object is named like gcal-1
              // we want all the elements of that pushed to events
              // calendar is an object
              var calId = Object.keys(calendar)[0];
              var calType = null;
              that.state.calendars.forEach((cal) => {
                if (cal.id === calId) calType = cal.type;
              });
              calendar[calId].forEach((event) => {
                if (calType === "Microsoft") {
                  event.start = new Date(event.start + "Z");
                  event.start = moment(event.start).local().format();
                  event.end = new Date(event.end + "Z");
                  event.end = moment(event.end).local().format();
                }
                event.calId = calId;
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

            let tomorrowsEvents = that.sortEvents(tomorrows);
            let todaysEvents = that.sortEvents(todays);
            chrome.storage.local.set({ todaysEvents }, function () {});
            chrome.storage.local.set({ tomorrowsEvents }, function () {});
            that.setState({ tomorrowsEvents });
            that.setState({ todaysEvents });
          }
          that.setState({ loading: false });
          clearInterval(that.intervalId);
        });
    }
  };

  sortEvents = (events) => {
    return events.sort(function (a, b) {
      if (moment(a.start).isAfter(moment(b.start))) {
        return 1;
      } else if (moment(b.start).isAfter(moment(a.start))) {
        return -1;
      } else {
        return 0;
      }
    });
  };

  // disconnect a calendar
  delete = (id) => {
    const { calendars, todaysEvents, tomorrowsEvents } = this.state;
    const { uuid } = this.props;
    const newCalendarsArray = calendars.filter((calendar) => {
      return calendar.id !== id;
    });
    const newTodays = todaysEvents.filter((event) => {
      return event.calId !== id;
    });
    const newTomorrows = tomorrowsEvents.filter((event) => {
      return event.calId !== id;
    });
    this.setState({
      calendars: newCalendarsArray,
      todaysEvents: newTodays,
      tomorrowsEvents: newTomorrows,
    });
    chrome.storage.local.set({ calendars: newCalendarsArray }, function () {});
    chrome.storage.local.set({ todaysEvents: newTodays }, function () {});
    chrome.storage.local.set({ tomorrowsEvents: newTomorrows }, function () {});

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
          if (data[calendarID].email && data[calendarID].connected) {
            const newItem = { ...data[calendarID], id: calendarID };
            calendars.push(newItem);
          }
        });
        chrome.storage.local.set({ calendars: calendars }, function () {});
        that.setState({ calendars });
      });
  }

  componentWillMount = () => {
    chrome.storage &&
      chrome.storage.local.get(
        ["todaysEvents", "tomorrowsEvents", "calendars"],
        (result) => {
          if (
            result["calendars"] ||
            result["todaysEvents"] ||
            result["tomorrowsEvents"]
          ) {
            this.setState({
              todaysEvents: result["todaysEvents"],
              tomorrowsEvents: result["tomorrowsEvents"],
              calendars: result["calendars"],
              loading: false,
            });
          }
        }
      );
  };

  componentDidMount() {
    this.intervalId = setInterval(async () => {
      await this.getCalendars();
      await this.fetchLatestEvents();
    }, 5000);
  }

  refresh = async () => {
    this.setState({ loading: true })
    await this.getCalendars();
    await this.fetchLatestEvents();
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
      return this.state.loading ? (
        <Spinner />
      ) : (
        <Events
          todaysEvents={todaysEvents}
          configureCalendars={() => {
            this.setState({ configureCalendars: true });
          }}
          tomorrowsEvents={tomorrowsEvents}
          refresh={this.refresh}
        />
      );
    }
  };

  render() {
    return this.renderProper();
  }
}
