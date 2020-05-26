import React from "react";

export default function ConfigureCalendars(props) {
  return (
    <div className="App">
      <div className="row">
        <h1>Connected Calendars:</h1>
        <p onClick={() => props.configureCalendars()} className="configure">
          my schedule
        </p>
      </div>
      {props.calendars &&
        props.calendars.map((calendar) => {
          return (
            <div className="row">
              <p className="instruction"> {calendar}</p>
              <button onClick={() => props.delete(calendar)}>delete</button>
            </div>
          );
        })}
      <div className="row">
        <button onClick={() => props.addNewCalendar()} className="new">
          Add new
        </button>
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
