import React from "react";
// import GoogleCalendarLogo from "./Logos/Google_Calendar.png";
// import OutlookLogo from "./Logos/Microsoft_Outlook_2013_logo.png";
// saving this here for future

const list = [
  "Login with google calendar",
  "allow notifications if you want reminders",
  "Click our extension icon to check your next calls!",
];

// const logos = [GoogleCalendarLogo];

export default function Onboarding(props) {
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
            <a onClick={() => props.auth()} className="cleanLink" href="#">
              Login
            </a>{" "}
            with google calendar
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
