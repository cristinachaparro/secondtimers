const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middlewares/auth.middlewares");

//POST "/api/auth/signup" => Register user in DB
router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;

  //fields are filled
  if (!email || !password) {
    res.status(400).json({ errorMessage: "All fields must be filled." });
    return;
  }

  //password is strong enough
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  if (passwordRegex.test(password) === false) {
    res.status(400).json({
      errorMessage:
        "Password must be at least 8 characters long and have one capital letter, one lower case letter and a special character.",
    });
    return;
  }

  try {
    //check that the user is not duplicated
    const correctEmail = await User.findOne({ email: email });
    if (correctEmail !== null) {
      res.status(400).json({ errorMessage: "Email already in use." });
      return;
    }

    const correctUsername = await User.findOne({ username: username });
    if (correctUsername !== null) {
      res.status(400).json({ errorMessage: "Username already in use." });
      return;
    }

    //encrypt password
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);
    await User.create({
      username: username,
      email: email,
      password: hashPassword,
    });
    res.status(201).json();
  } catch (error) {
    next(error);
  }

  res.json("Probando.");
});

//POST "/api/auth/login" => Validar las credenciales del usuario
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  //fields are filled
  if (!email || !password) {
    res.status(400).json({ errorMessage: "All fields must be filled." });
    return;
  }

  try {
    //verify user exits in DB
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      res.status(400).json({ errorMessage: "Email not valid." });
      return;
    }

    //verify that the password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (!isPasswordCorrect) {
      res.status(400).json({ errorMessage: "Password not valid." });
      return;
    }

    //token that identifies the user
    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
      username: foundUser.username,
    };

    //create token
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "2d", // 2 days
    });

    res.status(200).json({ authToken: authToken });
  } catch (error) {
    next(error);
  }
});

//GET "/api/auth/verify" => Verificar si el usuario está activo o no
router.get("/verify", isAuthenticated, (req, res, next) => {
  //middleware to verify token

  res.status(200).json(req.payload);
});

module.exports = router;
