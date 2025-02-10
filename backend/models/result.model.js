const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  score: {
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
});

const resultSchema = new mongoose.Schema(
  {
    testId: {
      type: String,
      required: true,
    },
    students: [studentSchema],
  },
  { timestamps: true }
);

const Result = mongoose.model("Result", resultSchema);
module.exports = Result;
