const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

console.log(process.env.PORT);

app.use(bodyParser.json());

// Routes
require("./routes/employee-routes")(app);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error(err, "Could not connect to MongoDB..."));

app.listen(process.env.PORT || 3000, () =>
  console.log(`listening on port ${process.env.PORT}...`)
);
