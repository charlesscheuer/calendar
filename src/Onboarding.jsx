import React, { Component } from "react";
import GoogleCalendarLogo from "./Logos/Google_Calendar.png";
import OutlookLogo from "./Logos/Microsoft_Outlook_2013_logo.png";
import { v4 as uuid } from "uuid";

const logos = [GoogleCalendarLogo, OutlookLogo];

/*global chrome*/

const backend_url =
  "https://us-central1-calendar-276823.cloudfunctions.net/nextcallfyi/";

const emailUs = () => {
  window.open("mailto:nextcall.xyz@gmail.com");
};

export default class Onboarding extends Component {
  constructor(props) {
    super(props);
    chrome.storage &&
      chrome.storage.local.get(["uuid"], (result) => {
        if (result && result["uuid"]) {
          this.state = {
            uuid: result["uuid"],
            cal_id: `Calendar_${props.numCalendars}`,
          };
        } else {
          this.state = {
            uuid: uuid(),
            cal_id: `Calendar_${props.numCalendars}`,
          };
        }
      });
  }

  connectCalendar = (google) => {
    chrome.storage.local.set({ connected: true }, function () {});
    chrome.storage.local.set({ uuid: this.state.uuid }, function () {});

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
      window.open(
        `https://connected.nextcall.xyz/api/microsoft/connect/${body.uuid}/${body.cal_id}`
      );
    }
  };

  render() {
    return (
      <div className="App">
        <div className={this.props.addNewCalendar ? "row" : "row row_start"}>
          <h1>Add a calendar</h1>
          {this.props.addNewCalendar && (
            <button className="delete" onClick={() => this.props.stopAdd()}>
              Cancel
            </button>
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
                    <div
                      className="calendarButton"
                      onClick={() => this.connectCalendar(index === 0)}
                    >
                      <img
                        src={logo}
                        className="logos_img"
                        alt={
                          index === 0
                            ? "Connect Google calendar"
                            : "Connect Outlook calendar"
                        }
                      />
                      <p className="join">
                        {index === 0 ? "Google Calendar" : "Outlook Calendar"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </li>
            {/* <li className="instruction">
              Allow notifications if you want reminders
            </li> */}
            <li className="instruction">
              Click our extension icon to check your next calls!
            </li>
          </ol>
        </div>
        <div className="row row_end">
          <div className="row_end">
            <p onClick={() => emailUs()} className="help">
              Need help?
            </p>
          </div>
        </div>
      </div>
    );
  }
}
