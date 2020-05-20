import React from "react";

import useInterval from "./UseInterval";

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

export default function Onboarding(props) {
  
  console.log("rendering onboarding...")
  
  const uuid = "karthik-test6";
  const cal_id = "gcal-1";

  const fetchConnectionStatus = async (uuid, cal_id) => {
    var api = backend_url + `google/connect/${uuid}/${cal_id}`;

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
            props.setEvents(data[cal_id]);
          });

          chrome.storage.sync.set({ uuid: uuid }, function () {
            props.setUuid(uuid);
          });
        }
      });
  };

  // Poll for connection status
  useInterval(async () => {
    chrome.storage.sync.get(["connected"], async (result) => {
      if (result["connected"]) await fetchConnectionStatus(uuid, cal_id);
    });
  }, 1000);

  const connectCalendar = () => {
    chrome.storage.sync.set({ connected: true }, function () {});

    var api = backend_url + "google/connect";

    var body = {
      uuid: uuid,
      cal_id: cal_id,
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
              onClick={() => connectCalendar()}
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
