import React, { Fragment } from "react";

import moment from 'moment'

var formatDateTime = (datetime) => {
  var dateObj = new Date(datetime)
  var momentObj = moment(dateObj)

  return momentObj.format('h:mm A');
}

var isToday = (datetime) => {
  var dateObj = new Date(datetime)
  var momentObj = moment(dateObj)

  return momentObj.isSame(new Date(), "day")
}

var isTomorrow = (datetime) => {
  var dateObj = new Date(datetime)
  var momentObj = moment(dateObj)

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return momentObj.isSame(tomorrow, "day")
}

export default function Connected(props) {
  
  console.log("rendering connected...")
  
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
          isToday(event.start) ? (
            <Fragment>
              <div className="row">
                <p className="time">{formatDateTime(event.start)}</p>
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
          ) : null
        );
      })}

      <div className="row">
        <div className="row_start">
          <p className="row_date">Tomorrow</p>
        </div>
      </div>
      <div className="row">
        <div className="row_divider"></div>
      </div>
      {props.events.map((event) => {
        return (
          isTomorrow(event.start) ? (
            <Fragment>
              <div className="row">
                <p className="time">{formatDateTime(event.start)}</p>
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
          ) : null
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
