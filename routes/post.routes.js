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
      category,
    });

    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

//GET "/api/destinations/:postId" => send post details by ID
router.get("/:postId", async (req, res, next) => {
  const { postId } = req.params;
  try {
    const response = await Post.findById(postId);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

//DELETE "/api/destinations/:postId" => delete post by ID
router.delete("/:postId", async (req, res, next) => {
  const { postId } = req.params;
  try {
    await Post.findByIdAndDelete(postId);
    res.json("The post has been deleted.");
  } catch (error) {
    next(error);
  }
});

//PATCH "/api/destinations/:postId" => update a post by ID
router.patch("/:postId", async (req, res, next) => {
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

module.exports = router;
