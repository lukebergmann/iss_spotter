const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  // Make a single API request to retrieve the users IP address
  request('https://api.ipify.org?format=json', (error, response, body) => {
    // Input:
    // if the error comes back with no IP address, return error
    if (error) return callback(error.null);
    // response.statusCode !== 200 says throw an error any status code other than 200 is recieved. 200 means everything is all good. 404 is page not found etc.
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    // change the IP address as a string using JSON.parse
    const ip = JSON.parse(body).ip;
    // if no error is present, and the ip address is good, call the next function
    callback(null, ip);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request('https://freegeoip.app/json/' + ip, (error, response, body) => {
    //if error is yes, and no coordinates are found, return error
    if (error) {
      callback(error, null);
      return;
    }
    // response.statusCode !== 200 says throw an error any status code other than 200 is recieved. 200 means everything is all good. 404 is page not found etc.
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
      return;
    }
    // changing latitude and longitude into a string using JSON.parse
    const { latitude, longitude } = JSON.parse(body);
    // if no error is present, and longitude and latitude are present, call the next function
    callback(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  //change the flyover times using coordinates longitude and latitude in the url link. declare to a new variable for easy using
  const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(url, (error, response, body) => {
    //if no passtime is found, return error
    if (error) {
      callback(error, null);
      return;
    }
    // response.statusCode !== 200 says throw an error any status code other than 200 is recieved. 200 means everything is all good. 404 is page not found etc.
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass time: ${body}`), null);
      return;
    }
    // if null error is passing, return passing ISS times
    const passingISS = JSON.parse(body).response;
    callback(null, passingISS);
  });
};

const nextISSTimesForMyLocation = function(callback) {

  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, location) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(location, (error, nextPassTime) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPassTime);
      });
    });
  });
};


module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};
