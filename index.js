var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI);
var bodyParser = require('body-parser');

var Entry = require('./app/models/entry.js');
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

router.route('/entries')
    .post(function (request, response) {
        var entry = new Entry();
        entry.text = request.body.text;
        entry.owner = request.body.owner;
        entry.created = new Date();
        if (!entry.text || !entry.owner) {
            response.status(400).send('Entries must have text and owner');
            return;
        }

        entry.save(function (err) {
            if (err) {
                response.send(err);
            }
            response.status(201).json(entry);
        });
    })
    .get(function (request, response) {
        Entry.find(function (err, entries) {
            if (err) {
                response.send(err);
            }
            response.json(entries);
        });
    });

router.route('/entries/:entry_id')
    .get(function (request, response) {
        Entry.findById(request.params.entry_id, function(err, entry) {
            if (err) {
                response.send(err);
            }
            if (entry) {
                response.json(entry);
            } else {
                response.status(404).send('Unable to find entry');
            }
        });
    })
    .delete(function(request, response) {
        Entry.remove({
            _id: request.params.entry_id
        }, function (err, entry) {
            if (err) {
                response.send(err);
            }
            if (entry) {
                response.status(204).send();
            } else {
                response.status(404).send('Unable to delete non-existent object');
            }
        });
    });

app.use('/api', router);

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
