const jwt = require("jsonwebtoken");
const employeeAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    console.log("verifying token");
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
};

module.exports = employeeAuthMiddleware;
