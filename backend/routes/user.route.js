const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcryptjs = require("bcryptjs");
const User = require("../models/user.model");

router.use(express.json());

function validate(req) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(255).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).max(100).required(),
  });

  return schema.validate(req);
}

async function hashPassword(password) {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

router.post("/signup", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { username, email, password } = req.body;

  const hashedPassword = await hashPassword(password);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res
      .status(201)
      .json({ message: "User signed up successfully", user: newUser });
  } catch (err) {
    res
      .status(500)
      .send("An unexpected error occurred. Please try again later.");
  }
});

module.exports = router;
