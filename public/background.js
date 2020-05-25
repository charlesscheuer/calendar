/*global chrome*/

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
        let events = [];
        let calendars = [];
        data.forEach((calendar) => {
          // data is array of objects
          // each object has a key with calender id that has an array of event objects
          calendars.push(Object.keys(calendar)[0]);
          calendar[Object.keys(calendar)[0]].forEach((event) => {
            events.push(event);
          });
        });
        chrome.storage.sync.set({ events }, function () {});
        chrome.storage.sync.set({ calendars }, function () {});
      }
    });
};

chrome.storage &&
  chrome.storage.sync.get(["uuid"], (result) => {
    if (Object.keys(result).length !== 0) fetchLatestEvents(result["uuid"]);
  });
