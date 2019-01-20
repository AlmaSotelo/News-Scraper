// scrape script
//====================

//Require request and cheerio, making our scrapes possible
var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb) {
   console.log("in Scrape function")
   
   request("http://www.nytimes.com", function(err, res, body) {
      
      var $ = cheerio.load(body);
      
      var articles = [];

      $("article h2").each(function(i, element) {
         console.log('In ')
         console.log(element, " this is the element")
         var head = $(this).text().trim();
         var sum = $(this).siblings("p").text();
         console.log(head, "This is the head");
         console.log(sum, "This is the sum");
            /// WE need to get the summary. 

            var dataToAdd = {
               headline: head,
               summary: sum
            };
            articles.push(dataToAdd);
        
      });

      console.log(articles, "scraped articles")
      
   });
   cb(articles);
};

module.exports = scrape;