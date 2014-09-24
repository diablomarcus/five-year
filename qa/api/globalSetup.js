var frisby = require('frisby');

module.exports = function () {
    frisby.globalSetup({
        retry: 2,
        retry_backoff: 1000,
        timeout: 20000,
        request: {
            headers: {
                'Content-Type': 'application/json'
            },
            inspectOnFailure: true
        }
    });
};
