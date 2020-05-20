import React, { Component } from "react";

// import GoogleCalendarLogo from "./Logos/Google_Calendar.png";
// import OutlookLogo from "./Logos/Microsoft_Outlook_2013_logo.png";
// saving this here for future

const list = [
  "Connect with google calendar",
  "allow notifications if you want reminders",
  "Click our extension icon to check your next calls!",
];

// const logos = [GoogleCalendarLogo];

/*global chrome*/

const backend_url =
  "https://us-central1-calendar-276823.cloudfunctions.net/nextcallfyi/";

export default class Onboarding extends Component {
  constructor(props) {
    super(props);
    console.log("rendering onboarding...");
    this.state = {
      uuid: "someuser",
      cal_id: "gcal-1",
    };
  }

  fetchConnectionStatus = async (uuid, cal_id) => {
    var api = backend_url + `google/connect/${uuid}/${cal_id}`;

    var setEvents = this.props.setEvents;
    var setUuid = this.props.setUuid;
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
        if (data["connected"]) {
          chrome.storage.sync.set({ events: data[cal_id] }, function () {
            setEvents(data[cal_id]);
          });

          chrome.storage.sync.set({ uuid: uuid }, function () {
            setUuid(uuid);
          });
        }
      });
  };

  //Poll for connection status
  pollStatus = () => {
    console.log("polling...");
    chrome.storage &&
      chrome.storage.sync.get(["connected"], async (result) => {
        if (result["connected"])
          await this.fetchConnectionStatus(this.state.uuid, this.state.cal_id);
      });
  };

  componentWillMount = () => {
    var delay = 999999999;
    chrome.storage &&
      chrome.storage.sync.get(["delay"], (result) => {
        if (result["delay"]) delay = result["delay"];
        this.timer = setInterval(() => this.pollStatus(), delay);
      });
  };

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
    chrome.storage.sync.set({ delay: null }, function () {});
  }

  connectCalendar = () => {
    chrome.storage.sync.set({ connected: true }, function () {});
    chrome.storage.sync.set({ delay: 1000 }, function () {});

    var api = backend_url + "google/connect";

    var body = {
      uuid: this.state.uuid,
      cal_id: this.state.cal_id,
    };

    fetch(api, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(async function (data) {
        await window.open(data);
      });
  };

  render() {
    return (
      <div className="App">
        <div className="row row_start">
          <h1>Next meetings</h1>
        </div>
        <div className="row row_start">
          <h3 className="welcome">Welcome to next call</h3>
        </div>
        <div className="row row_start">
          <p className="description">
            It looks like you haven't connected any calendars yet.
          </p>
        </div>
        <div className="row row_start">
          <ol>
            <li className="instruction">
              <a
                onClick={() => this.connectCalendar()}
                className="cleanLink"
                href="#0"
              >
                Connect
              </a>{" "}
              your google calendar
            </li>
            <li className="instruction">
              Allow notifications if you want reminders
            </li>
            <li className="instruction">
              Click our extension icon to check your next calls!
            </li>
          </ol>
        </div>
        <div className="row row_end">
          <div className="row_end">
            <p className="help">Need help?</p>
          </div>
        </div>
      </div>
    );
  }
}
