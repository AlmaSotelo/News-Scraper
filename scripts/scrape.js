// scrape script
//====================

//Require request and cheerio, making our scrapes possible
var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb) {
   //console.log("in Scrape function")
   
   request("https://www.nytimes.com/section/world", function(err, res, body) {
      
      var $ = cheerio.load(body);
      var articles = [];

      $("div.story-body").each(function(i, element) {
         //console.log('In ')
         //console.log(element, " this is the element")
         var head = $(element).find("h2.headline").text().trim();
         var sum = $(element).find("p.summary").text().trim();
         console.log(head, "This is the head");
         console.log(sum, "This is the sum");

            var dataToAdd = {
               headline: head,
               summary: sum
            };
            articles.push(dataToAdd);
        
      });

      //console.log(articles, "scraped articles")
      cb(articles);
   });
   
};

module.exports = scrape;