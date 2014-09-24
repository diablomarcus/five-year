var config = {},
    util = require('util'),
    port = process.env.PORT || '5000',
    request = require('request-json');

console.log("Using port: " + port);
config.rootUrl = util.format('http://localhost:%s/api', port);
        
module.exports = config;
