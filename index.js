var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI);
var bodyParser = require('body-parser');

var attachEntryRoutes = require('./app/routes/entryRoutes.js');
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

attachEntryRoutes(router);

app.use('/api', router);

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
