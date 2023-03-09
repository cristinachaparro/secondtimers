const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  comment: String,
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
});

const Comment = model("Comment", commentSchema);

module.exports = Comment;
