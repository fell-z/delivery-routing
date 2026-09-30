const testData = {
  jobs: [
    {
      location: [1.98465, 48.70329],
      timeWindow: [32400, 36000],
    },
    {
      location: [2.03655, 48.61128],
    },
    {
      location: [2.39719, 49.07611],
    },
    {
      location: [2.41808, 49.22619],
    },
    {
      location: [2.28325, 48.5958],
    },
    {
      location: [2.89357, 48.90736],
    },
  ],
  vehicle: { startPos: [2.35044, 48.51764] },
};

import { map } from "map";

const placeObjectSelect = document.getElementById("place-object-select");
const resetButton = document.getElementById("reset-button");
const calculateRouteButton = document.getElementById("calculate-route-button");
const jobEntryList = document.getElementById("job-entries");

document.addEventListener("DOMContentLoaded", () => {
  map.setup();
  map.placeObject = placeObjectSelect.value;
});

placeObjectSelect.addEventListener("change", (e) => {
  map.placeObject = e.target.value;
});

resetButton.addEventListener("click", () => {
  jobEntryList.querySelectorAll("li").forEach((li) => {
    li.remove();
  })
  calculateRouteButton.disabled = false;
  map.map.eachLayer((l) => {
    if (l instanceof L.Marker || l instanceof L.Polyline) {
      l.remove();
    }
  })
})

calculateRouteButton.addEventListener("click", async (e) => {
  const jobEntries = jobEntryList.querySelectorAll(".job-entry");

  const jobs = [];

  jobEntries.forEach((je) => {
    const { jobId } = je.dataset;
    const parsedJobId = parseInt(jobId);

    const jobMarker = map.jobMarkers.get(parsedJobId);
    const jobLocation = jobMarker.getLatLng();

    let description = je.querySelector('input[name="desc"]').value;
    if (description.length === 0) {
      description = `Id: ${parsedJobId}`;
    }

    const fromTimeString = je.querySelector('input[name="from"]').value;
    const toTimeString = je.querySelector('input[name="to"]').value;

    const timeWindow = [
      convertTimeToSeconds(...parseTimeString(fromTimeString)),
      convertTimeToSeconds(...parseTimeString(toTimeString)),
    ];

    const newJob = {
      id: parsedJobId,
      description,
      location: [jobLocation.lng, jobLocation.lat],
      timeWindow,
    };
    jobs.push(newJob);
  });

  const vehicleMarker = map.vehicleMarker;
  const vehicleLocation = vehicleMarker.getLatLng();

  const payload = {
    jobs,
    vehicle: {
      startPos: [vehicleLocation.lng, vehicleLocation.lat],
    },
  };

  console.log(JSON.stringify(payload, null, 2));

  const res = await fetch("/api/route", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();

  console.log(JSON.stringify(data, null, 2));

  const route = data?.routes[0];
  const encodedGeometry = route.geometry;

  map.addPolyline(encodedGeometry);

  map.jobMarkers.forEach((v) => v.remove());
  map.jobMarkers.clear();
  jobEntryList.querySelectorAll("li").forEach((li) => {
    li.querySelectorAll("input").forEach((input) => {
      input.disabled = true;
    });
    li.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
    });
  });
  calculateRouteButton.disabled = true;

  let jobOrder = 1;
  route.steps.forEach((s) => {
    const latlng = [s.location[1], s.location[0]];

    if (s.type === "start") {
      map.addMarker(latlng, "vehicle", 1, true, "Começo/Fim");
    } else if (s.type === "job") {
      map.addMarker(latlng, "job", s.id, true, `${jobOrder++}. ${s.description}`);
    }
  });
});

function parseTimeString(timeString) {
  const parts = timeString.split(":");
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);

  return [hours, minutes];
}

function convertTimeToSeconds(hours, minutes) {
  return hours * 60 * 60 + minutes * 60;
}
