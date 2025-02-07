const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Question = require("../models/question.model");
const auth = require("../middlewares/auth.middleware");
const Test = require("../models/test.model");

router.use(express.json());

function validate(req) {
  const schema = Joi.object({
    testId: Joi.string().required(),
    question: Joi.string().required(),
    subject: Joi.string().required(),
    options: Joi.array().items(Joi.string()).length(4).required(),
    correctOption: Joi.array().items(Joi.string()).required(),
    marks: Joi.number().min(0).required(),
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

  const {
    testId,
    question,
    subject,
    options,
    correctOption,
    marks,
    negativeMarks,
  } = req.body;
  const newQuestion = new Question({
    testId,
    question,
    subject,
    options,
    correctOption,
    marks,
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
  try {
    const { testId } = req.query;

    const exam = await Test.findById(testId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    if (req.user.isAdmin) {
      const questions = await Question.find({ testId });
      return res.status(200).json(questions);
    }

    const currentTime = new Date();
    const startTime = new Date(exam.testDate);
    const [hours, minutes] = exam.startTime.split(":");

    startTime.setHours(hours, minutes, 0, 0);
    if (currentTime.toDateString() > startTime.toDateString()) {
      return res.status(400).json({ message: "Exam has not started yet." });
    }

    if (currentTime < startTime) {
      return res.status(400).json({ message: "Exam has not started yet." });
    }

    const questions = await Question.find({ testId });
    return res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res.status(500).json({ message: "Failed to fetch questions." });
  }
});
router.put("/updateQuestion/:id", auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(400).send("You are not allowed to update this question");
  }
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const {
    testId,
    question,
    subject,
    options,
    correctOption,
    marks,
    negativeMarks,
  } = req.body;
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          testId,
          question,
          subject,
          options,
          correctOption,
          marks,
          negativeMarks,
        },
      },
      { new: true }
    );
    res.status(200).json({
      message: "Question created successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    alert(error.message);
  }
});
router.delete("/deleteQuestion/:id", auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(400).send("You are not allowed to delete this question");
  }
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.status(200).json("Question has been deleted");
  } catch (error) {
    alert(error.message);
  }
});
module.exports = router;
