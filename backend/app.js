const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const router = require("./routes/api.js");
const app = express();
const port = 3000;
const connectDB = require("./db/database.js");
const cors = require("cors");

async function start() {
  try {
    console.log("Connecting to DB:", process.env.DB_URI);
    await connectDB();
    app.listen(port, () => {
      console.log("App is Listenting");
    });
    app.use(express.json());
    app.use([cors(), express.urlencoded({ extended: true }), router]);
  } catch (error) {
    console.log("Failed to start app:", error);
  }
}

start();
