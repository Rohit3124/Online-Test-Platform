const config = require("config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");

if (!config.get("jwtSecretKey")) {
  throw new Error("FATAL ERROR: jwtSecretKey is not defined");
}

app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

mongoose
  .connect("mongodb://localhost/online-test")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
