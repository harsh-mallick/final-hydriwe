const dotenv = require('dotenv');

const mongoose = require('mongoose');
dotenv.config({ path: "./config.env" })

// Connect to mongoDb Atlas database
const DB = process.env.DATABASE;

mongoose.connect(DB).then(() => {
    console.log("connection successful")
}).catch((err) => {
    console.log("Connection string error in const DB", err)
})

