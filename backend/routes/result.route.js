const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Result = require("../models/result.model");
const auth = require("../middlewares/auth.middleware");

router.use(express.json());

function validate(req) {
  const schema = Joi.object({
    testId: Joi.string().required(),
    studentId: Joi.string().required(),
    score: Joi.number().required(),
    rank: Joi.number().required(),
    answers: Joi.array()
      .items(
        Joi.object({
          questionId: Joi.string().required(),
          selectedOption: Joi.string().required(),
          isCorrect: Joi.boolean().required(),
        })
      )
      .required(),
  });

  return schema.validate(req);
}

router.post("/create", auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(400).send("You are not allowed to create a result");
  }
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { testId, studentId, score, rank, answers } = req.body;

  try {
    const newResult = new Result({
      testId,
      studentId,
      score,
      rank,
      answers,
    });

    await newResult.save();

    res.status(201).json({
      message: "Result created successfully",
      result: newResult,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong. Please try again later.");
  }
});

module.exports = router;
