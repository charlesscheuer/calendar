import React, { useState, useEffect } from "react";

import useInterval from "./UseInterval";
import Spinner from "./Spinner";

// import GoogleCalendarLogo from "./Logos/Google_Calendar.png";
// import OutlookLogo from "./Logos/Microsoft_Outlook_2013_logo.png";
// saving this here for future

const list = [
  "Connect with google calendar",
  "allow notifications if you want reminders",
  "Click our extension icon to check your next calls!",
];

// const logos = [GoogleCalendarLogo];

const backend_url =
  "https://us-central1-calendar-276823.cloudfunctions.net/nextcallfyi/";

export default function Onboarding(props) {
  let [loaded, setLoaded] = useState(false);
  const uuid = "placeholder";

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
        props.setUuid(uuid);
        props.getCalendars(uuid);
        props.setEvents(data[cal_id]);
        props.setEvloaded(true);
        setLoaded(true);
      });
  };

  // Poll for connection status
  useInterval(async () => {
    await fetchConnectionStatus(uuid, "gcal-1");
  }, 1000);

  const connectCalendar = () => {
    var api = backend_url + "google/connect";

    var body = {
      uuid: uuid,
      cal_id: "gcal-1",
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
        window.open(data);
      });
  };

  return loaded ? (
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
  ) : (
    <Spinner />
  );
}
