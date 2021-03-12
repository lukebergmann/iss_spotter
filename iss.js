const request = require('request')

const fetchMyIP = function (callback) {
  // use request to fetch IP address from JSON API
  // Make a single API request to retrieve the users IP address
  request('https://api.ipify.org?format=json', (error, response, body) => {
    // Input: 
    // A callback (to pass back an error or the IP string) that returns (via callback)
    if (error) return callback(error.null);
    // An error, if any (nullable)
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${respone.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    // The IP address as a string (null if error)
    const ip = JSON.parse(body).ip
    callback(null, ip);
  });
};

module.exports = { fetchMyIP };