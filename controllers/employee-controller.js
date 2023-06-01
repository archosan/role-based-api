const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee");
const jwt = require("jsonwebtoken");

const employeeSignup = async (req, role, res) => {
  const { name, email, password } = req.body;
  try {
    //Get employee from database with same name if any
    const validateEmployeename = async (name) => {
      let employee = await Employee.findOne({ name });
      return employee ? false : true;
    };

    //Get employee from database with same email if any
    const validateEmail = async (email) => {
      let employee = await Employee.findOne({ email });
      return employee ? false : true;
    };
    // Validate the name
    let nameNotTaken = await validateEmployeename(name);
    if (!nameNotTaken) {
      return res.status(400).json({
        message: `Employee name is already taken.`,
      });
    }

    // validate the email
    let emailNotRegistered = await validateEmail(email);
    if (!emailNotRegistered) {
      return res.status(400).json({
        message: `Email is already registered.`,
      });
    }

    // Hash password using bcrypt
    const hashedPassword = bcrypt.hash(
      password,
      null,
      null,
      function (err, hash) {
        // Addd nulls
        if (!err) callback(hash);
      }
    );
    // create a new user
    const newEmployee = new Employee({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newEmployee.save();
    return res.status(201).json({
      message: "Hurry! now you are successfully registred. Please nor login.",
    });
  } catch (err) {
    // Implement logger function if any
    return res.status(500).json({
      message: `${err.message}`,
    });
  }
};

const employeeLogin = async (req, role, res) => {
  const { name, password } = req.body;
  // First Check if the employee is in the database
  const employee = await Employee.findOne({ name });
  if (!employee) {
    return res.status(404).json({
      message: "Employee not found. Invalid login credentials.",
      success: false,
    });
  }
  // We will check the role if the employee is logging in via the route for his department
  if (employee.role !== role) {
    return res.status(403).json({
      message: "Please make sure you are logging in from the right portal.",
      success: false,
    });
  }
  // That means employee is existing and trying to signin fro the right portal
  // Now check for the password
  let isMatch = await bcrypt.compare(password, employee.password);
  if (isMatch) {
    // Sign in the token and issue it to the employee
    let token = jwt.sign(
      {
        name: employee.name,
        role: employee.role,
        email: employee.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7 days",
      }
    );
    let result = {
      name: employee.name,
      role: employee.role,
      email: employee.email,
      token: `Bearer ${token}`,
      expiresIn: 168,
    };
    return res.status(200).json({
      ...result,
      message: "Hurray! You are now logged in.",
      success: true,
    });
  } else {
    return res.status(403).json({
      message: "Incorrect password.",
      success: false,
    });
  }
};

module.exports = {
  employeeSignup,
  employeeLogin,
};
