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
        console.log("refreshing events...")

        let events = data.map(calendar => calendar[Object.keys(calendar)[0]])[0]
        chrome.storage.sync.set({ events: events }, function () {});
      }
    });
};

chrome.storage &&
chrome.storage.sync.get(["uuid"], (result) => {
  if (Object.keys(result).length !== 0) fetchLatestEvents(result["uuid"]);
});

