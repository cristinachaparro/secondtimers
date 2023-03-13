const { Schema, model } = require("mongoose");
const countries = require("../utils/countries");
const categories = require("../utils/categories");

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    // required: true,
    enum: countries,
  },
  description: {
    type: String,
    required: true,
  },
  image: [
    {
      type: String,
    },
  ],
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    enum: categories,
  },
});

const Post = model("Post", postSchema);

module.exports = Post;
