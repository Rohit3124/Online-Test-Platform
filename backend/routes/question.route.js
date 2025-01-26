const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Question = require("../models/question.model");
const auth = require("../middlewares/auth.middleware");

router.use(express.json());

function validate(req) {
  const schema = Joi.object({
    question: Joi.string().required(),
    options: Joi.array().items(Joi.string()).length(4).required(),
    correctOption: Joi.array().items(Joi.number().min(1).max(4)).required(),
    negativeMarks: Joi.number().min(0).optional(),
  });

  return schema.validate(req);
}

router.post("/create", auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(400).send("You are not allowed to create a post");
  }
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { question, options, correctOption, negativeMarks } = req.body;
  const newQuestion = new Question({
    question,
    options,
    correctOption,
    negativeMarks,
  });
  try {
    await newQuestion.save();
    res.status(200).json({
      message: "Question created successfully",
      question: newQuestion,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong. Please try again later.");
  }
});

module.exports = router;
