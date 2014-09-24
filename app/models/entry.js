var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EntrySchema = new Schema({
    text: String,
    owner: String,
    created: Date
});

module.exports = mongoose.model('Entry', EntrySchema);
