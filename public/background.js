/*global chrome*/

import moment from "../node_modules/moment/moment.js";
console.log("reached background");

const isToday = (datetime) => {
  var dateObj = new Date(datetime);
  var momentObj = moment(dateObj);
  return momentObj.isSame(new Date(), "day") && momentObj.isAfter();
};

const isTomorrow = (datetime) => {
  var dateObj = new Date(datetime);
  var momentObj = moment(dateObj);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return momentObj.isSame(tomorrow, "day");
};

const backend_url =
  "https://us-central1-calendar-276823.cloudfunctions.net/nextcallfyi/";

const fetchLatestEvents = (uuid) => {
  var api = backend_url + `refresh/events/${uuid}`;
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
      if (data.length !== 0) {
        console.log("refreshing events...");
        let events = { today: [], tomorrrow: [] };
        let calendars = [];
        data.forEach((calendar) => {
          // data is array of objects
          // each object has a key with calender id that has an array of event objects
          calendars.push(Object.keys(calendar)[0]);
          calendar[Object.keys(calendar)[0]].forEach((event) => {
            // refactor to stop traversing once you pass events that aren't today
            if (isToday(event.start)) {
              events.today = [...events.today, event];
            } else if (isTomorrow(event.start)) {
              events.tomorrow = [...events.tomorrow, event];
            }
          });
        });
        console.log("reached fetch latest events");
        console.log("events object", events);
        chrome.storage.sync.set({ events }, function () {});
        // chrome.storage.sync.set({ calendars }, function () {});
      }
    });
};

const fetchCalendars = (uuid) => {
  var api = backend_url + `/calendars/${uuid}`;
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
      if (data.length !== 0) {
        console.log(data, "get calendars response");
        // chrome.storage.sync.set({ events }, function () {});
        // chrome.storage.sync.set({ calendars }, function () {});
      }
    });
};

chrome.storage &&
  chrome.storage.sync.get(["uuid"], (result) => {
    if (Object.keys(result).length !== 0) {
      fetchLatestEvents(result["uuid"]);
      fetchCalendars(result["uuid"]);
    }
  });
