//Bring in our scrape script and makeDate scripts
var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

// Bring in the Headline and Note mongoose models
var Headline = require("../models/Headline");

module.exports = {
   fetch: function(cb) {
      scrape(function(data) {
         var articles = data;
         //console.log(data, "these are articles in call back *************")
         for (var i=0; i < articles.length; i++) {
            articles[i].date = makeDate();
            articles[i].saved = false;
         }
         console.log(articles.length)
         //mongo function
         //Ponere los articles en el database []
          Headline.insertMany(articles, {ordered:false}, function(err, docs){
           cb(err, docs);
            
          });
        // Headline.create(articles);
      });
   },
   delete: function (query, cb) {
      Headline.remove(query, cb);
   },
   get: function(query, cb) {
      Headline.find(query).sort({
         _id: -1
      })
      .exec(function(err, doc){
         cb(doc);
      });
   },
   update: function(query, cb) {
      Headline.update({_id: query._id}, {
         $set: query
      }, {}, cb);
   }
};
