const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decodedPayload = jwt.verify(token, config.get("jwtSecretKey"));
    req.user = decodedPayload;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
}

module.exports = auth;
