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
  axios.get("https://www.bbc.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    var articleArr = [];

    $("div.media__content").each(function (i, element) {
      //save result as an empty object that I can iterate over the responses and push to the object
      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      articleArr.push(result);

    });

    db.Article.create(articleArr).then(() => res.send("Just performed the scrape!")).catch(err => {
      console.error(err);
      res.json(err);
    });

  });
});

// in the news db I made, GET from the headlines
app.get("/headlines", function (req, res) {
  db.headlines.find({}).then(function (dbArticle) {
    res.json(dbArticle);
  }).catch(err => {
    res.json(err);
  });
});

// in the news db I made, GET the headlines/articles by their id parameter using express (app)
app.get("/headlines/:id", function (req, res) {
  db.headlines.findOne({ _id: req.params.id }).populate("note").then(function (dbArticle) {
    res.json(dbArticle);
  }).catch(function(err) {
    res.json(err);
  });
});

// in the news db I made, set up route for changing any articles' comment(s)
app.post("/headlines/:id", function (req, res) {
  db.Note.create(req.body).then(function (dbNote) {
    return db.Article.findOneAndUpdate( {_id: req.params.id }, { new: true });
  }).then(function(dbArticle) {
    res.json(dbArticle);
  }).catch(function(err) {
    res.json(err);
  });
});

// tell the server to start running
app.listen(PORT, function() {
  console.log("App is running on PORT " + PORT);
});