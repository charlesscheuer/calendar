import React, { Fragment } from "react";
import moment from "moment";

import Refresh from "./Refresh";

var formatDateTime = (datetime) => {
  var dateObj = new Date(datetime);
  var momentObj = moment(dateObj);

  return momentObj.format("h:mm A");
};

const emailUs = () => {
  window.open("mailto:nextcall.xyz@gmail.com");
};

export default function Connected(props) {
  const { todaysEvents, tomorrowsEvents } = props;
  return (
    <div className="App">
      <div className="row">
        <h1>NextCall</h1>
        <p onClick={() => props.configureCalendars()} className="configure">
          configure calendars
        </p>
      </div>
      {todaysEvents && todaysEvents.length < 1 && tomorrowsEvents.length < 1 && (
        <div className="row">
          <p className="description" style={{ color: "#0c334d;" }}>
            It looks like you don't have any upcoming events... Please reload
            your calendar events.
          </p>
          <Refresh refresh={props.refresh} />
        </div>
      )}
      {todaysEvents &&
        todaysEvents.length > 0 && [
          <div className="row">
            <div className="row_start">
              <p className="row_date">Today</p>
            </div>
            <Refresh refresh={props.refresh} />
          </div>,
          <div className="row">
            <div className="row_divider"></div>
          </div>,
        ]}

      {todaysEvents &&
        todaysEvents.length > 0 &&
        todaysEvents.map((event, index) => {
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
              {index !== todaysEvents.length - 1 && (
                <div className="row">
                  <div className="row_divider"></div>
                </div>
              )}
            </Fragment>
          );
        })}

      {tomorrowsEvents &&
        tomorrowsEvents.length > 0 && [
          <div className="row">
            <div className="row_start">
              <p className="row_date">Tomorrow</p>
            </div>
            {todaysEvents && todaysEvents.length < 1 && (
              <Refresh refresh={props.refresh} />
            )}
          </div>,
          <div className="row">
            <div className="row_divider"></div>
          </div>,
        ]}
      {tomorrowsEvents &&
        tomorrowsEvents.length > 0 &&
        tomorrowsEvents.map((event, index) => {
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
              {index !== tomorrowsEvents.length - 1 && (
                <div className="row">
                  <div className="row_divider"></div>
                </div>
              )}
            </Fragment>
          );
        })}
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
