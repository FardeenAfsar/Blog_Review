const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Load environment variables using dotenv
dotenv.config({ path: "./config/config.env" });

// Connect DB
connectDB();

const app = express();

// Logger
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// View engine
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(`Server running on ${process.env.NODE_ENV} mode on port: ${PORT}`)
);
