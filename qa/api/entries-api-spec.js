(function () {
    'use strict';
    var config = require('./apiTestConfig'),
        frisby = require('frisby'),
        util = require('util'),
        uuid = require('node-uuid');

    require('./globalSetup')();
    require('sugar');

    var entriesUrl = config.rootUrl + '/entries';
    var entryStructure = {
        _id: String,
        text: String,
        created: String,
        owner: String
    };
    
    frisby.create('list on entries')
    .get(entriesUrl)
    .expectStatus(200)
    .expectJSONTypes('*', entryStructure)
    .toss();

    var entryWithoutText = {
        text: null,
        owner: uuid.v1()
    };
    frisby.create('Cannot create without text')
    .post(entriesUrl, entryWithoutText, {json: true})
    .expectStatus(400)
    .toss();

    var entryWithoutOwner = {
        text: uuid.v1(),
        owner: null
    };
    frisby.create('Cannot create without owner')
    .post(entriesUrl, entryWithoutOwner, {json: true})
    .expectStatus(400)
    .toss();

    var entryToCreate = {
        text: uuid.v1(),
        owner: uuid.v1()
    };
    frisby.create('create on entries')
    .post(entriesUrl, entryToCreate, {json: true})
    .expectStatus(201)
    .expectJSON(entryToCreate)
    .afterJSON(function (entry) {
        var entryUrl = entriesUrl + '/' + entry._id;

        frisby.create('Can find created entry in list')
        .get(entriesUrl)
        .expectStatus(200)
        .expectJSON('?', entryToCreate)
        .toss();

        frisby.create('Can find created entry by url')
        .get(entryUrl)
        .expectJSON(entryToCreate)
        .expectStatus(200)
        .toss();

        frisby.create('cleanup entry')
        .delete(entryUrl)
        .expectStatus(204)
        .toss();

        frisby.create('Cannot find deleted entry')
        .get(entryUrl)
        .expectStatus(404)
        .toss();

        frisby.create('Cannot update deleted entry')
        .put(entryUrl, entryToCreate, {json: true})
        .expectStatus(404)
        .toss();

        frisby.create('Cannot delete deleted entry')
        .delete(entryUrl)
        .expectStatus(404)
        .toss();
    })
    .toss();
})();
