const employeeController = require("../controllers/employee-controller");
const employeeAuthMiddleware = require("../middlewares/employee-middleware");
const roleCheckMiddleware = require("../middlewares/role-check-middleware");

module.exports = function (app) {
  app.post("/register/:role", async (req, res) => {
    const { role } = req.params;
    await employeeController.employeeSignup(req, role, res);
  });

  app.post("/login/:role", async (req, res) => {
    const { role } = req.params;
    await employeeController.employeeLogin(req, role, res);
  });

  app.get(
    "/test",
    employeeAuthMiddleware,
    roleCheckMiddleware(["devs"]),
    (req, res) => {
      res.send("Hello World!");
    }
  );
};
