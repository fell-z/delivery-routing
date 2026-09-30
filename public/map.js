const jobEntryTemplate = document.getElementById("job-entry-template");
const jobEntryList = document.getElementById("job-entries");

const map = {
  nextJobId: 1,

  placeObject: "nothing",

  jobMarkers: new Map(),
  vehicleMarker: null,

  currentPolyline: null,

  setup() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        this.map = L.map("map").setView([latitude, longitude], 13);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(this.map);

        this.map.on("click", this.onMapClick);
      },
      (e) => console.error(e),
    );
  },

  // can't use 'this' on event handler function, have to reference directly
  onMapClick(e) {
    console.log(`Clicked, placeObject: ${map.placeObject}`);
    map.addMarker(e.latlng, map.placeObject, map.nextJobId);
    if (map.placeObject === "job") {
      map.nextJobId++;
    }
  },

  addMarker(latlng, type, id, markerOnly = false, popupText = "") {
    if (type === "nothing") {
      return;
    }

    const markerOptions = {
      job: {
        title: `Trabalho ${id}`,
        draggable: true,
      },
      vehicle: {
        icon: L.icon({
          iconUrl: "assets/car.png",
          iconSize: [48, 48],
        }),
        draggable: true,
      },
    };

    if (type === "job") {
      console.log("Placing job");

      const newJobMarker = L.marker(latlng, markerOptions.job)
        .addTo(map.map)
        .bindPopup(popupText);

      if (!markerOnly) {
        map.jobMarkers.set(id, newJobMarker);
        map.addNewJobEntry(id);
      }
    } else if (type === "vehicle") {
      console.log("Placing vehicle");

      const newVehicleMarker = L.marker(latlng, markerOptions.vehicle)
        .addTo(map.map)
        .bindPopup(popupText);

      if (!markerOnly) {
        if (map.vehicleMarker) {
          map.vehicleMarker.remove();
        }
        map.vehicleMarker = newVehicleMarker;
      }
    }
  },

  addNewJobEntry(jobId) {
    const newJobEntry = document.importNode(jobEntryTemplate.content, true);

    newJobEntry.querySelector(".job-entry").dataset.jobId = jobId;
    newJobEntry.querySelector(".remove-job-button").addEventListener("click", this.removeJobEntry);

    jobEntryList.append(newJobEntry);
  },

  removeJobEntry(e) {
    const { jobId } = e.target.parentElement.dataset;
    const parsedJobId = parseInt(jobId);

    console.log(`Job entry being removed. Id: ${parsedJobId}`);

    if (!isNaN(parsedJobId)) {
      const job = map.jobMarkers.get(parsedJobId);
      if (job) {
        map.jobMarkers.delete(parsedJobId);
        job.remove();
        e.target.removeEventListener("click", this.removeJobEntry);
        e.target.parentElement.remove();
      }
    }

    console.log(map.jobMarkers);
  },

  addPolyline(encodedGeometry) {
    const polyline = L.Polyline.fromEncoded(encodedGeometry).addTo(map.map);
    if (map.currentPolyline) {
      map.currentPolyline.remove();
    }
    map.currentPolyline = polyline;
  }
};

export { map };
