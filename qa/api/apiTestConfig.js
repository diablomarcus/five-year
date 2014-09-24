var config = {},
    util = require('util'),
    port = process.env.PORT || '5000',
    environment = process.env.ENV || 'local',
    request = require('request-json');

if (environment === 'PROD') {
    config.rootUrl = 'http://fiveyear.herokuapp.com/api';
} else {
    console.log("Using port: " + port);
    config.rootUrl = util.format('http://localhost:%s/api', port);
}
        
console.log("Using rootUrl: " + config.rootUrl);
module.exports = config;
