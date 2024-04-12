require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connect = require("./db/connection");
const asyncHandler = require("express-async-handler");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/user", require("./routes/userRout"));
app.use("/contect", require("./routes/contectRout"));

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connect();
    app.listen(PORT, () => {
      console.log("Connected successfully to the database!");
      console.log(`Server is listening on port ${PORT}!`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit with failure
  }
};

start();
