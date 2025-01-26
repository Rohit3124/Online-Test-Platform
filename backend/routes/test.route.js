const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Test = require("../models/test.model");
const auth = require("../middlewares/auth.middleware");

router.use(express.json());

function validate(req) {
  const schema = Joi.object({
    testName: Joi.string().required(),
    testDate: Joi.date().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    totalMarks: Joi.number().required(),
  });

  return schema.validate(req);
}

router.post("/create", auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(400).send("You are not allowed to create a post");
  }
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { testName, testDate, startTime, endTime, totalMarks } = req.body;
  const newTest = new Test({
    testName,
    testDate,
    startTime,
    endTime,
    totalMarks,
  });
  try {
    await newTest.save();
    res
      .status(200)
      .json({ message: "Test created successfully", test: newTest });
  } catch (err) {
    alert(err.message);
    res.status(500).send("Something went wrong. Please try again later.");
  }
});

module.exports = router;
