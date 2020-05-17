import React from "react";

export default function Connected(props) {
  return (
    <div className="App">
      <div className="row">
        <h1>Next meetings</h1>
        <p className="configure">configure calendars</p>
      </div>
      <div className="row">
        <div className="row_start">
          <p className="row_date">Today</p>
        </div>
      </div>
      <div className="row">
        <div className="row_divider"></div>
      </div>
      <div className="row">
        <p className="time">12:00PM</p>
        <p className="title">Stilt Standup</p>
        <a className="join" target="blank" href="#">
          Join
        </a>
      </div>
      <div className="row">
        <div className="row_divider"></div>
      </div>
      <div className="row">
        <p className="time">01:00PM</p>
        <p className="title">User interview</p>
      </div>
      <div className="row">
        <div className="row_start">
          <p className="row_date">Tomorrow</p>
        </div>
      </div>
      <div className="row">
        <div className="row_divider"></div>
      </div>
      <div className="row">
        <p className="time">12:00PM</p>
        <p className="title">Stilt Standup</p>
      </div>
      <div className="row">
        <div className="row_divider"></div>
      </div>
      <div className="row">
        <p className="time">01:00PM</p>
        <p className="title">User interview</p>
      </div>
      <div className="row row_end">
        <div className="row_end">
          <p className="help">Need help?</p>
        </div>
      </div>
    </div>
  );
}
