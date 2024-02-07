const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    available: {
        type: Number,
        required: true,
    },
    lat: {
        type: Number,
        required: true,
    },
    long: {
        type: Number,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    startdate: {
        type: String,
        required: true,
    },
    enddate: {
        type: String,
        required: true,
    },
    des: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
})

const drives = mongoose.model('Clean Up Drives', userSchema);


module.exports = drives;