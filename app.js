// importing things
require('dotenv').config()
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");
const app = express();
const path = require('path')
require('./db/conn')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())

app.use(require("./router/auth"));
app.use(cors());



app.use(express.static(path.join(__dirname, "./client/build")))

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"))
})

// make a localhost with port
dotenv.config({ path: "./config.env" });

// app.use(express.static(path.join(__dirname, "./client/build")))

// app.get("*", function(req, res){
//   res.sendFile(path.join(__dirname, "./client/build/index.html"))
// })

const server = app.listen(process.env.PORT || 8000, () => {
  console.log(`Express is working on port ${server.address().port}`);
});
