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
    subject: Joi.array().items(Joi.string().required()).required(),
    syllabus: Joi.string().required(),
  });

  return schema.validate(req);
}

router.post("/create", auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(400).send("You are not allowed to create a test");
  }

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const {
    testName,
    testDate,
    startTime,
    endTime,
    totalMarks,
    subject,
    syllabus,
  } = req.body;

  const newTest = new Test({
    testName,
    testDate,
    startTime,
    endTime,
    totalMarks,
    subject,
    syllabus,
  });

  try {
    await newTest.save();
    res.status(200).json({
      message: "Test created successfully",
      test: newTest,
      testId: newTest._id,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Something went wrong. Please try again later.");
  }
});

router.get("/getExams", auth, async (req, res) => {
  try {
    const exams = await Test.find();
    return res.status(200).json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
    return res.status(500).json({ message: "Failed to fetch exams." });
  }
});

router.put("/updateExam/:id", auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(400).send("You are not allowed to update this test");
  }

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const {
    testName,
    testDate,
    startTime,
    endTime,
    totalMarks,
    subject,
    syllabus,
  } = req.body;

  try {
    const updatedTest = await Test.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          testName,
          testDate,
          startTime,
          endTime,
          totalMarks,
          subject,
          syllabus,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedTest);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error updating the test.");
  }
});

router.delete("/deleteExam/:id", auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(400).send("You are not allowed to delete this test");
  }
  try {
    await Test.findByIdAndDelete(req.params.id);
    res.status(200).json("Test has been deleted");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error deleting the test.");
  }
});

module.exports = router;
