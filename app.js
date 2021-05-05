const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/db");

// Load environment variables using dotenv
dotenv.config({ path: "./config/config.env" });

// Load passport config
require("./config/passport")(passport);

// Connect DB
connectDB();

const app = express();

// Body parse
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Static directory
app.use(express.static(path.join(__dirname, "public")));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(`Server running on ${process.env.NODE_ENV} mode on port: ${PORT}`)
);
