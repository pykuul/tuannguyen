const mongoose = require("mongoose");

const { Schema } = mongoose;
const blogSchema = new Schema({
  title: String,
  author: String,
  body: String,
  comments: [{ body: String, date: Date }],
  createdAt: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number
  }
});

const BlogPost = mongoose.model("BlogPost", blogSchema);
module.exports = BlogPost;
