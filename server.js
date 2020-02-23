var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
require('dotenv').config()

var axios = require("axios");
var cheerio = require("cheerio");


var db = require("./models");
var PORT = process.env.PORT || 3000;
var app = express();


app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/econScrape",{useUrlParser: true });


// Routes
// ============================================================
var keyword = "China";
// var keyword2 = "Chinese";
// var keyword3 = "Xi"
var articleArr = [];

// SCRAPE from the Economist:
// ---------------------------------------------------
app.get("/scrape", function(req,res){
  var economistURL = "http://www.economist.com/";
  axios.get(economistURL)
    .then(function(response){
      var $ = cheerio.load(response.data);
      $("div.teaser__text").each(function(i, element) {
        var result = {};
        //.includes <= array method
        
        // Get Page Elements:
        // FullText:
        var fulltext = $(element).children().text();
          // Category:
          // result.category = $(element).find(".section-fly").attr("value");
          // Title:
          result.title = $(element).find("h3").text();
          // Link:
          var articleLink = $(element).find(".headline-link").attr("href");
          result.link = economistURL + articleLink;
          // Description:
          // result.description = $(element).find(".teaser__description").text();
          
          let findKeyword = (string) => {
            var n = string.search(keyword);
            if (n > 0){
              db.Article.create(result)
                .then(function(dbArticle){
                  console.log(dbArticle);
                })
                .catch(function(err){
                  console.log(err);
                })
              }
            }

          
        if (!articleArr.includes(result.title)){
          articleArr.push(result.title);
          findKeyword(fulltext);
        }

        
         

      })
      res.send("<h1>We dunnit</h1>"); //res.render some stuff - probably in handlebars
    })
});






// Get ALL Articles from Database:
// ---------------------------------------------------
app.get("/articles",function(req,res){
  db.Article.find({})
    .then(function(articlesFromDB){
      res.json(articlesFromDB);
    })
    .catch(function(err){
      res.json(err);
    })
})

// Get a SPECIFIC article from the database:
// ---------------------------------------------------
app.get("/articles/:id", function(req,res){
  db.Article.find({_id: req.params.id})
  .populate("comment")
  .then(function(comment){
    res.json(comment)
  })
  .catch(function(err){
    res.json(err);
  });
});

// save/update an articles comments:
app.post("/articles/:id", function(req,res){
  db.Comment.create(req.body)
  .then(function(dbComment){
    return db.Article.findOneAndUpdate(
      {_id: req.params.is},
      {node: dbComment._id},
      {new: true}
      )
  })
})


// Server:
app.listen(PORT, function(){
  console.log(`Doin' it all on port ${PORT}!`)
});