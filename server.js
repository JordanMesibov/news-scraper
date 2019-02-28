//import dependencies

const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");
let PORT = 3000;

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mogodb://localhost/news", { useNewUrlParser: true });

//set up the routes
app.get("/scrape", function (req, res) {
  axios.get("http://")
})