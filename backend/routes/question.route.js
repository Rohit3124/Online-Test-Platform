const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Question = require("../models/question.model");
const auth = require("../middlewares/auth.middleware");

router.use(express.json());

function validate(req) {
  const schema = Joi.object({
    testId: Joi.string().required(),
    question: Joi.string().required(),
    options: Joi.array().items(Joi.string()).length(4).required(),
    correctOption: Joi.array().items(Joi.string()).required(),
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

  const { testId, question, options, correctOption, negativeMarks } = req.body;
  const newQuestion = new Question({
    testId,
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
router.get("/getQuestions", auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(400).send("You are not allowed to see a questions");
  }
  try {
    const questions = await Question.find({ testId: req.query.testId });

    return res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res.status(500).json({ message: "Failed to fetch questions." });
  }
});
router.put("/updateQuestion/:id", auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(400).send("You are not allowed to update a question");
  }
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { testId, question, options, correctOption, negativeMarks } = req.body;
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      {
        $set: { testId, question, options, correctOption, negativeMarks },
      },
      { new: true }
    );
    res.status(200).json(updatedQuestion);
  } catch (error) {
    alert(error.message);
  }
});
module.exports = router;
