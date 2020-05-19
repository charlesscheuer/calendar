import React, { useState, useEffect } from "react";

import Connected from "./Connected";
import Onboarding from "./Onboarding";
import Spinner from "./Spinner";

import "./App.scss";

const backend_url =
  "https://us-central1-calendar-276823.cloudfunctions.net/nextcallfyi/";

function App() {
  let [calloaded, setCalloaded] = useState(false);
  let [evloaded, setEvloaded] = useState(false);
  let [calendars, setCalendars] = useState({});
  let [events, setEvents] = useState([]);
  let [uuid, setUuid] = useState("nouser");

  useEffect(() => {
    getCalendars(uuid);
    getEvents(uuid);
  }, []);

  const getEvents = (uuid) => {
    var api = backend_url + `/refresh/events/${uuid}`;

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
        var events = [];
        for (let i = 0; i < data.length; i++) {
          let elem = data[i];
          let cal = Object.keys(data[i])[0];
          events.push.apply(events, elem[cal]);
        }

        setEvents(events);
        setEvloaded(true);
      });
  };

  const getCalendars = (uuid) => {
    var api = backend_url + `calendars/${uuid}`;

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
        console.log(data);
        if (data) setCalendars(data);
        setCalloaded(true);
      });
  };

  return calloaded && evloaded ? (
    Object.keys(calendars).length !== 0 ? (
      <Connected events={events} />
    ) : (
      <Onboarding
        setEvents={setEvents}
        setEvloaded={setEvloaded}
        getCalendars={getCalendars}
        setUuid={setUuid}
      />
    )
  ) : (
    <Spinner />
  );
}

export default App;
