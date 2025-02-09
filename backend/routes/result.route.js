const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Result = require("../models/result.model");
const auth = require("../middlewares/auth.middleware");

router.use(express.json());

function validate(req) {
  const schema = Joi.object({
    testId: Joi.string().required(),
    students: Joi.array()
      .items(
        Joi.object({
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
        })
      )
      .required(),
  });

  return schema.validate(req);
}

router.post("/create", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { testId, students } = req.body;

  try {
    const newResult = new Result({
      testId,
      students,
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

router.get("/getResults", auth, async (req, res) => {
  try {
    const studentId = req.user.id;
    const { resultId } = req.query;

    let results;

    if (resultId) {
      results = await Result.findOne({
        _id: resultId,
        "students.studentId": studentId,
      });
      if (!results) {
        return res.status(404).json({ message: "Result not found." });
      }
    } else {
      results = await Result.find({ "students.studentId": studentId });
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    return res.status(500).json({ message: "Failed to fetch results." });
  }
});

module.exports = router;
