import React from "react";

export default function ConfigureCalendars(props) {
  const emailUs = () => {
    window.open("mailto:nextcall.xyz@gmail.com");
  };

  return (
    <div className="App">
      <div className="row">
        <h1>Connected Calendars</h1>
        <p onClick={() => props.configureCalendars()} className="configure">
          my schedule
        </p>
      </div>
      {props.calendars &&
        props.calendars.map((calendar) => {
          return (
            <div key={calendar.id} className="row account">
              <p className="instruction"> {calendar.email}</p>
              <button
                className="delete"
                onClick={() => props.delete(calendar.id)}
              >
                Disconnect
              </button>
            </div>
          );
        })}
      <div className="row">
        <button
          onClick={() => props.addNewCalendar(props.calendars)}
          className="new"
        >
          Add new
        </button>
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
