import React, { useState, useEffect } from "react";
import moment from "moment";

import Connected from "./Connected";
import Onboarding from "./Onboarding";
import Spinner from "./Spinner";

import "./App.scss";

/*global chrome*/

function App() {
  console.log("rendering root...");
  let [calendars, setCalendars] = useState(null);
  let [events, setEvents] = useState(null);
  let [todaysEvents, setTodaysEvents] = useState([]);
  let [tomorrowsEvents, setTomorrowsEvents] = useState([]);
  let [uuid, setUuid] = useState(null);
  let [loaded, setLoaded] = useState(false);

  var isToday = (datetime) => {
    var dateObj = new Date(datetime);
    var momentObj = moment(dateObj);
    return momentObj.isSame(new Date(), "day");
  };

  var isTomorrow = (datetime) => {
    var dateObj = new Date(datetime);
    var momentObj = moment(dateObj);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return momentObj.isSame(tomorrow, "day");
  };

  useEffect(() => {
    chrome.storage &&
      chrome.storage.sync.get(["events"], (result) => {
        if (Object.keys(result).length !== 0 && result["events"] !== events) {
          const useThis = result["events"];
          console.log(useThis, "u suck jackass");
          useThis.forEach((event) => {
            if (isToday(event.start)) {
              setTodaysEvents([...todaysEvents, event]);
            } else if (isTomorrow(event.start)) {
              setTomorrowsEvents([...tomorrowsEvents, event]);
            }
          });
          setEvents(result["events"]);
        }
      });

    chrome.storage &&
      chrome.storage.sync.get(["uuid"], (result) => {
        if (Object.keys(result).length !== 0) setUuid(result["uuid"]);
      });

    chrome.storage &&
      chrome.storage.sync.get(["calendars"], (result) => {
        if (Object.keys(result).length !== 0) setCalendars(result["calendars"]);
      });

    setLoaded(true);
  }, [events, todaysEvents, tomorrowsEvents]);

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
      <Connected
        todaysEvents={todaysEvents}
        tomorrowsEvents={tomorrowsEvents}
      />
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
