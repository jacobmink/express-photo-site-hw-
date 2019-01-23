const mongoose = require('mongoose');
const photoSchema = mongoose.Schema({
    title: String,
    url: {type: String, required: true}
});

const Photo = mongoose.model('Photo', photoSchema);


module.exports = Photo;