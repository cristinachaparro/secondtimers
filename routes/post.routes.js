const isAuthenticated = require("../middlewares/auth.middlewares");
const router = require("express").Router();
const countries = require("../utils/countries");
const categories = require("../utils/categories");

const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");

// GET "/api/destinations" => All posts list
router.get("/", async (req, res, next) => {
  try {
    const allPosts = await Post.find();
    res.json(allPosts);
  } catch (error) {
    next(error);
  }
});

router.get("/country-list", (req, res, next) => {
  try {
    res.json(countries);
  } catch (error) {
    next(error);
  }
});

router.get("/categories", (req, res, next) => {
  try {
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// POST "/api/destinations" => Create a new post
router.post("/create-form", isAuthenticated, async (req, res, next) => {
  const { title, country, description, image, category } = req.body;
  if (!country || !title || !description) {
    res.status(400).json({ errorMessage: "All fields must be filled." });
    return;
  }
  try {
    const response = await Post.create({
      title: title,
      country: country,
      description: description,
      image: image,
      category: category,
      creator: req.payload._id,
    });

    res.status(200).json({ id: response._id });
  } catch (error) {
    next(error);
  }
});

//GET "/api/destinations/:postId" => send post details by ID
router.get("/:postId", async (req, res, next) => {
  const { postId } = req.params;
  try {
    const response = await Post.findById(postId).populate("creator");
    res.json(response);
  } catch (error) {
    next(error);
  }
});

//DELETE "/api/destinations/:postId" => delete post by ID
router.delete("/:postId", isAuthenticated, async (req, res, next) => {
  const { postId } = req.params;
  try {
    await Post.findByIdAndDelete(postId);
    res.json("The post has been deleted.");
  } catch (error) {
    next(error);
  }
});

//PATCH "/api/destinations/:postId" => update a post by ID
router.patch("/:postId", isAuthenticated, async (req, res, next) => {
  const { postId } = req.params;
  const { title, country, description, image, category } = req.body;
  try {
    await Post.findByIdAndUpdate(postId, {
      title,
      country,
      description,
      image,
      category,
    });
    res.json("The post has been updated.");
  } catch (error) {
    next(error);
  }
});

// ..............COMMENTS............... //

// //GET "/api/destinations/:postId/comment" => find all comments
// router.get("/comments", async (req, res, next) => {
//   try {
//     const allComments = await Comment.find().populate("post");
//     res.json(allComments);
//   } catch (error) {
//     next(error);
//   }
// });

//POST "/api/destinations/:postId/comment" => add a new comment
router.post("/:postId/comment", isAuthenticated, async (req, res, next) => {
  const { postId } = req.params;
  const { comment } = req.body;

  try {
    const singleComment = await Comment.create({
      comment: comment,
      creator: req.payload._id,
      post: postId,
    });
    res.json("Comment correctly created.");
  } catch (error) {
    next(error);
  }
});

//DELETE "/api/destinations/:commentId" => delete comment by ID
router.delete("/:commentId", isAuthenticated, async (req, res, next) => {
  const { commentId } = req.params;
  try {
    await Post.findByIdAndDelete(commentId);
    res.json("The comment has been deleted.");
  } catch (error) {
    next(error);
  }
});

//PATCH "/api/destinations/:commentId" => update a comment by ID
router.patch("/:commentId", isAuthenticated, async (req, res, next) => {
  const { commentId } = req.params;
  const { comment } = req.body;
  try {
    await Comment.findByIdAndUpdate(commentId, {
      comment: comment,
      creator: req.payload._id,
      post: postId,
    });
    res.json("The comment has been updated.");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
