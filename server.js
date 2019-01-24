//Require out dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");//This was added after we check the server was actually listening
var bodyParser = require("body-parser");//This was added after we check the server was actually listening

//Set up our port to be either the host's designated port, or 3000
var PORT = process.env.PORT || 3000;

//Instantiate our Express App
var app = express();

//Set up an Express Router
var router = express.Router();

//Require our routes file pass our router object
require("./config/routes")(router);

//Designate our public folder as a static directory
app.use(express.static(__dirname + "/public"));

//Connect Handlebars to our Exoress app. This was added after we check the server was actually listening
app.engine("handlebars", expressHandlebars ({
   defaultLayout: "main"
}));
app.set("view engine", "handlebars"); 

//Use bodyParser in our app. This was added after we check the server was actually listening
app.use(bodyParser.urlencoded({
   extended: false
}));

//Have every request go trhough our router middleware
app.use(router);

//If deployed, use the deployed database. Otherwise use the local mongoHeadLines database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadLines";

//Connect mongoose to our database
mongoose.connect(db, function(error) {
   //Log any errors connecting with mongoose
   if (error) {
      console.log(error);
   }
   //Or log a success message
   else {
      console.log("mongoose connection is successful");
   }
})
//Listen on the port
app.listen(PORT, function() {
   console.log("Listening on port:" + PORT);
});