var Entry = require('../models/entry.js');

function attachToRouter(router) {
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
    .put(function(request, response) {
        Entry.findById(request.params.entry_id, function (err, entry) {
            if (err) {
                response.send(err);
                return;
            }
            if (entry) {
                if (entry.owner !== request.body.owner) {
                    response.status(400).send('Cannot update owner');
                    return;
                }
                entry.text = request.body.text;
                entry.save(function(err) {
                    if (err) {
                        response.send(err);
                    }
                    response.json(entry);
                });
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
}

module.exports = attachToRouter;
