import React, { Fragment } from "react";
import moment from "moment";

var formatDateTime = (datetime) => {
  var dateObj = new Date(datetime);
  var momentObj = moment(dateObj);
  return momentObj.format("h:mm A");
};

export default function Connected(props) {
  console.log("rendering connected...");
  let { today, tomorrow } = props.events;
  console.log(
    props.events.today,
    props.events.tomorrow,
    props.events,
    "FROM CONECT"
  );
  console.log(props.events, "PROPS EVENTS");
  return (
    <div className="App">
      <div className="row">
        <h1>Next meetings</h1>
        <p onClick={() => props.configureCalendars()} className="configure">
          configure calendars
        </p>
      </div>
      {today &&
        today.length > 0 && [
          <div className="row">
            <div className="row_start">
              <p className="row_date">Today</p>
            </div>
          </div>,
          <div className="row">
            <div className="row_divider"></div>
          </div>,
        ]}

      {today &&
        today.length > 0 &&
        today.map((event, index) => {
          return (
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
              {index !== today.length - 1 && (
                <div className="row">
                  <div className="row_divider"></div>
                </div>
              )}
            </Fragment>
          );
        })}

      {tomorrow &&
        tomorrow.length > 0 && [
          <div className="row">
            <div className="row_start">
              <p className="row_date">Tomorrow</p>
            </div>
          </div>,
          <div className="row">
            <div className="row_divider"></div>
          </div>,
        ]}
      {tomorrow &&
        tomorrow.length > 0 &&
        tomorrow.map((event, index) => {
          return (
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
              {index !== tomorrow.length - 1 && (
                <div className="row">
                  <div className="row_divider"></div>
                </div>
              )}
            </Fragment>
          );
        })}
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
