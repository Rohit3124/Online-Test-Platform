const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const testRoutes = require("./routes/test.route");
const questionRoutes = require("./routes/question.route");
const resultRoutes = require("./routes/result.route");

if (!process.env.JWT_SECRET_KEY) {
  throw new Error("FATAL ERROR: jwtSecretKey is not defined");
}

app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/exam", testRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/result", resultRoutes);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
