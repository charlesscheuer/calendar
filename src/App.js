import React, { useState, useEffect } from "react";

import Connected from "./Connected";
import Onboarding from "./Onboarding";
import Spinner from "./Spinner";

import "./App.scss";

/*global chrome*/

function App() {
  
  console.log("rendering root...")
  
  let [calendars, setCalendars] = useState(null);
  let [events, setEvents] = useState(null);
  let [uuid, setUuid] = useState(null);

  let [loaded, setLoaded] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(["events"], (result) => {
      if (Object.keys(result).length !== 0) setEvents(result["events"]);
    });

    chrome.storage.sync.get(["uuid"], (result) => {
      if (Object.keys(result).length !== 0) setUuid(result["uuid"]);
    });

    chrome.storage.sync.get(["calendars"], (result) => {
      if (Object.keys(result).length !== 0) setCalendars(result["calendars"]);
    });

    setLoaded(true);
  }, []);

  // const getEvents = (uuid) => {
  //   var api = backend_url + `/refresh/events/${uuid}`;

  //   fetch(api, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then(function (response) {
  //       return response.json();
  //     })
  //     .then(function (data) {
  //       var events = [];
  //       for (let i = 0; i < data.length; i++) {
  //         let elem = data[i];
  //         let cal = Object.keys(data[i])[0];
  //         events.push.apply(events, elem[cal]);
  //       }

  //       setEvents(events);
  //       setEvloaded(true);
  //     });
  // };

  // const getCalendars = (uuid) => {

  //   var api = backend_url + `calendars/${uuid}`;

  //   fetch(api, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then(function (response) {
  //       return response.json();
  //     })
  //     .then(function (data) {
  //       console.log(data);
  //       if (data) setCalendars(data);
  //       setCalloaded(true);
  //     });
  // };

  return loaded ? (
    uuid !== null ? (
      <Connected events={events} />
    ) : (
      <Onboarding
        setUuid={setUuid}
        setCalendars={setCalendars}
        setEvents={setEvents}
      />
    )
  ) : (
    <Spinner />
  );
}

export default App;
