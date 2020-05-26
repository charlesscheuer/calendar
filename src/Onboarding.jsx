import React, { Component } from "react";

import GoogleCalendarLogo from "./Logos/Google_Calendar.png";
import OutlookLogo from "./Logos/Microsoft_Outlook_2013_logo.png";

const list = [
  "Connect with google calendar",
  "allow notifications if you want reminders",
  "Click our extension icon to check your next calls!",
];

const logos = [GoogleCalendarLogo, OutlookLogo];

/*global chrome*/
// <li className="instruction">
//               <a
//                 onClick={() => this.connectCalendar()}
//                 className="cleanLink"
//                 href="#0"
//               >
//                 Connect
//               </a>{" "}
//               your google calendar
//             </li>

const backend_url =
  "https://us-central1-calendar-276823.cloudfunctions.net/nextcallfyi/";

export default class Onboarding extends Component {
  constructor(props) {
    super(props);
    console.log("rendering onboarding...");
    this.state = {
      uuid: "someuser",
      cal_id: "ms-1",
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

  connectCalendar = (google) => {
    chrome.storage.sync.set({ connected: true }, function () {});
    chrome.storage.sync.set({ delay: 1000 }, function () {});

    var api = backend_url + "google/connect";

    var body = {
      uuid: this.state.uuid,
      cal_id: this.state.cal_id,
    };

    if (google) {
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
    } else {
      console.log("reached msft");
      fetch(backend_url + `microsoft/connect/${body.uuid}/${body.cal_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(function (response) {
          return response.json();
        })
        .then(async function (data) {
          console.log(data);
          await window.open(data);
        });
    }
  };

  render() {
    return (
      <div className="App">
        <div className={this.props.addNewCalendar ? "row" : "row row_start"}>
          <h1>Add a calendar</h1>
          {this.props.addNewCalendar && (
            <p
              onClick={() => this.props.stopAdd()}
              className="configure configure_cancel"
            >
              Cancel add calendar
            </p>
          )}
        </div>
        <div className="row row_start">
          <h3 className="welcome">
            {this.props.addNewCalendar
              ? "Connect a new calendar"
              : "Welcome to next call"}
          </h3>
        </div>
        {!this.props.addNewCalendar && (
          <div className="row row_start">
            <p className="description">
              It looks like you haven't connected any calendars yet.
            </p>
          </div>
        )}

        <div className="row row_start">
          <ol>
            <li className="instruction">
              <div>Connect your calendar:</div>
              <div className="logos">
                {logos.map((logo, index) => {
                  return (
                    <img
                      src={logo}
                      className="logos_img"
                      onClick={() => this.connectCalendar(index === 0)}
                      alt={
                        index === 0
                          ? "Connect Google calendar"
                          : "Connect Outlook calendar"
                      }
                    />
                  );
                })}
              </div>
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
            <a href="mailto:hi@charlesscheuer.com" className="help">
              Need help?
            </a>
          </div>
        </div>
      </div>
    );
  }
}
