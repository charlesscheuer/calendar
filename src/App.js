import React from "react";
import "./App.scss";

function App() {
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
        <a className="join" href="#">
          Join
        </a>
      </div>
    </div>
  );
}

export default App;
