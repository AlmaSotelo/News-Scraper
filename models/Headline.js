var mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;

var headlineSchema = new Schema({
   headline: {
      type: String,
      required: true,
      unique: true
     
   },
   summary: {
      type: String,
      required:true
   },
   date: String,
   saved: {
      type: Boolean,
      default: false
   }
});
headlineSchema.plugin(uniqueValidator);

var Headline =mongoose.model("Headline", headlineSchema);
module.exports = Headline;