const { expressjwt } = require("express-jwt");

const isAuthenticated = expressjwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload", // it allows us to have the token's payload to know that the user is the one that's logged in
  getToken: (req) => {
    if (req.headers === undefined || req.headers.authorization === undefined) {
      return null;
    }

    const tokenArr = req.headers.authorization.split(" ");
    const tokenType = tokenArr[0];
    const token = tokenArr[1];

    if (tokenType !== "Bearer") {
      return null;
    }

    return token;
  },
});

module.exports = isAuthenticated;
