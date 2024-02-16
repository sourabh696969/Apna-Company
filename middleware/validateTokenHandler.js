const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const validateUserToken = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.Authorization || req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("user is not authorised");
      }
      req.user = decoded.user;
      next();
    });
    if (!token) {
      res.status(401);
      throw new Error("user is not authorised or token is missing");
    }
  }
});

module.exports = {
  validateUserToken,
};
