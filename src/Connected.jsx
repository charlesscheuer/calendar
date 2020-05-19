import React, { Fragment } from "react";

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
      {props.events.map((event) => {
        return (
          <Fragment>
            <div className="row">
              <p className="time">{event.start}</p>
              <p className="title">{event.summary}</p>
              {event.url ? (
                <a className="join" target="blank" href={event.url}>
                  Join
                </a>
              ) : null}
            </div>
            <div className="row">
              <div className="row_divider"></div>
            </div>
          </Fragment>
        );
      })}
      <div className="row row_end">
        <div className="row_end">
          <p className="help">Need help?</p>
        </div>
      </div>
    </div>
  );
}
