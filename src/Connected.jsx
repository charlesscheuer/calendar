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
          if (data.length !== 0 && data) {
            var todays = [];
            var tomorrows = [];
            console.log("data", data);
            data.forEach((calendar) => {
              // data is an array of objects
              // each object is named like gcal-1
              // we want all the elements of that pushed to events
              // calendar is an object
              var calId = Object.keys(calendar)[0];
              var calType = null;
              console.log("calendars", that.state.calendars);
              that.state.calendars.forEach((cal) => {
                if (cal.id === calId) calType = cal.type;
              });
              console.log("calendar", calendar);
              calendar[calId].forEach((event) => {
                if (calType === "Microsoft") {
                  event.start = new Date(event.start + "Z");
                  event.start = moment(event.start).local().format();
                  event.end = new Date(event.end + "Z");
                  event.end = moment(event.end).local().format();
                }
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
            chrome.storage.sync.set({ todaysEvents: todays }, function () {});
            chrome.storage.sync.set(
              { tomorrowsEvents: tomorrows },
              function () {}
            );
            that.setState({ tomorrowsEvents: tomorrows });
            that.setState({ todaysEvents: todays });
            that.setState({ loading: false });
            clearInterval(that.intervalId);
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
        console.log("here", Object.keys(data));
        Object.keys(data).forEach((calendarID) => {
          if (data[calendarID].email && data[calendarID].connected) {
            const newItem = { ...data[calendarID], id: calendarID };
            calendars.push(newItem);
          }
        });
        chrome.storage.sync.set({ calendars: calendars }, function () {});
        that.setState({ calendars });
        console.log("set calendars", calendars);
      });
  }

  componentWillMount = () => {
    chrome.storage &&
      chrome.storage.sync.get(
        ["todaysEvents", "tomorrowsEvents", "calendars"],
        (result) => {
          console.log("result....", result["calendars"]);
          if (result["calendars"] || result["todaysEvents"] || result["tomorrowsEvents"]) {
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
      await this.fetchLatestEvents(5000);
    }, 5000);
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
        this.state.loading?
        <Spinner/> :
        (<Events
          todaysEvents={todaysEvents}
          configureCalendars={() => {
            this.setState({ configureCalendars: true });
          }}
          tomorrowsEvents={tomorrowsEvents}
        />)
      );
    }
  };

  render() {
    return this.renderProper();
  }
}
