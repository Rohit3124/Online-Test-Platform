const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    testId: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    rank: {
      type: Number,
      required: true,
    },
    answers: [
      {
        questionId: {
          type: String,
          required: true,
        },
        selectedOption: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Result = mongoose.model("Result", resultSchema);
module.exports = Result;
