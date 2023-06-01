module.exports = (roles) =>
  async function (req, res, next) {
    const userRole = req.user.role;
    console.log("checking role");

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: "You are not authorized to access this route.",
        success: false,
      });
    }

    next();
  };
