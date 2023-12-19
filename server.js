require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const logger = require("./middleware/logger").logger;
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConn");
const corsOptions = require("./config/corsOptions");

const PORT = process.env.PORT || 3500;

// Initialize Express App
const app = express();

console.log(`Environment: ${process.env.NODE_ENV}`);

// Database Connection
connectDB();

// Middlewares
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Static Files
app.use("/", express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/root"));
app.use("/reviews", require("./routes/reviewRoutes"));

// 404 Handler
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// Error Handler
app.use(errorHandler);

// MongoDB Event Listeners
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.error(err);
  require("./middleware/logger").logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
