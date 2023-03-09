const isAuthenticated = require("../middlewares/auth.middlewares");
const router = require("express").Router();

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

// POST "/api/destinations" => Create a new post
router.post("/create-form", async (req, res, next) => {

    const { title, country, description, image, category } = req.body;

  try {
    const response = await Post.create({
      title,
      country,
      description,
      image,
      category
    });

    res.status(200).json()
  } catch (error) {
    next(error);
  }
});

module.exports = router;
