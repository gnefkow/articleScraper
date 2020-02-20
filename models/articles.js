var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  category: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  link: {
    type: String,
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;