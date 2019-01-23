const mongoose = require('mongoose');
const Photo = require('./photos');


const userSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    photos: [Photo.schema]
})

const User = mongoose.model('User', userSchema);


module.exports = User;