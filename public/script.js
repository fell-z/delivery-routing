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

// const callAPIButton = document.getElementById("btn--call-api");
// const apiOutput = document.getElementById("api-output");
//
// callAPIButton.addEventListener("click", async (e) => {
//   const res = await fetch("/api/route", {
//     method: "POST",
//     headers: {
//       "Accept": "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(testData),
//   });
//   const data = await res.json();
//
//   console.log(data);
//   apiOutput.textContent = JSON.stringify(data, null, 2);
// });
