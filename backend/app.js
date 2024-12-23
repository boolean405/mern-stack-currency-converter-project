require("dotenv").config();
const express = require("express");
const rateLimit = require("express-rate-limit");
const axios = require("axios");
const helper = require("./utils/helper");

const app = express();

// Environment variables
const port = process.env.PORT || 3000;
const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

const appLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(express.json()); // for parsing application/json
app.use(appLimiter); // apply to all requests

// Routes
app.post("/api/convert", async (req, res, next) => {
  try {
    const results = req.body;
    const { from, to, amount } = results;

    const url = `${API_URL}/${API_KEY}/pair/${from}/${to}/${amount}`;
    const response = await axios.get(url);

    if (response.data && response.data.result === "success") {
      helper.resMsg(res, "Currency Convert", [response.data]);
    }
  } catch (error) {
    next(new Error(error.message));
  }
});

// // Routes
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// Error handling middleware
app.use((err, req, res, next) => {
  err.status = err.status || 500;
  res.status(err.status).json({ con: false, msg: err.message });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
