const router = require("express").Router();
const User = require("../models/User.model");
const isAuthenticated = require("../middlewares/auth.middlewares");

// GET "/profile" => Show your private profile
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const response = await User.findById(req.payload._id);

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// // GET "/profile/user/:id" => Show a profile
router.get("/user/:id", isAuthenticated, async (req, res, next) => {
  try {
    const response = await User.findById(req.params.id);

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET "/profile/edit-form" => Edit your profile
router.get("/edit-form", isAuthenticated, async (req, res, next) => {
  try {
    const response = await User.findById(req.payload._id);
  } catch (error) {
    next(error);
  }
});

// PATCH "/profile/edit-form" => Update your profile in the DB
router.patch("/edit-form", isAuthenticated, async (req, res, next) => {
  const { username, email, password, profilePicture, location, age } = req.body;

  try {
    await User.findByIdAndUpdate(req.payload._id, {
      username,
      email,
      password,
      profilePicture,
      location,
      age,
    });
    res.json("Profile updated.");
  } catch (error) {
    next(error);
  }
});

// GET "/profile/favourites" => shows the favourite list
router.get("/favourites", isAuthenticated, async (req, res, next) => {
  const userId = req.payload._id;

  try {
    const userResponse = await User.findById(userId).populate("favouritePosts");

    res.json(userResponse);
  } catch (err) {
    next(err);
  }
});

// DELETE "/profile/favourite/:postId/delete"
router.post(
  "/favourite/:postId/delete",
  isAuthenticated,
  async (req, res, next) => {
    const { postId } = req.params;
    const userId = req.payload._id;

    try {
      await User.findByIdAndUpdate(userId, {
        $pull: { favouritePosts: postId },
      });
      res.json("The post has been removed to favourite.");
    } catch (err) {
      next(err);
    }
  }
);

// GET "/api/profile/:userId" => See the author profile
router.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;
  try {
    const response = await User.findById(userId);
    res.json(response);
  } catch (error) {
    next(err);
  }
});

module.exports = router;
