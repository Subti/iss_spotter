const { nextISSTimesForMyLocation } = require("./iss_promised");

const printPasses = function (passTimes) {
  for (let pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPasses(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });
