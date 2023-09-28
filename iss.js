const request = require("request");

const fetchMyIP = function (callback) {
  request("https://api.ipify.org?format=json", (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body);
    return callback(null, data.ip);
  });
};

const fetchCoordsByIP = function (ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    const data = JSON.parse(body);

    if (data.success == false) {
      const msg = `Server status was ${data.success}. \nServer says: ${data.message}. \nAre you sure the IP address ${data.ip} is correct? \n`;
      callback(Error(msg), null);
      return;
    }

    const coords = {
      latitude: data.latitude,
      longitude: data.longitude,
    };
    return callback(null, coords);
  });
};

const fetchISSFlyOverTimes = function (coords, callback) {
  request(
    `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`,
    (error, response, body) => {
      if (error) {
        return callback(erorr, null);
      }

      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching fly over times. Response: ${body}`;
        callback(Error(msg), null);
        return;
      }

      const data = JSON.parse(body);
      return callback(null, data.response);
    }
  );
};

const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coords, (error, data) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, data);
      });
    });
  });
};

module.exports = {
  nextISSTimesForMyLocation,
};
