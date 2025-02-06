const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    testName: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: [String],
      required: true,
    },
    syllabus: {
      type: String,
      required: true,
    },

    testDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Test = mongoose.model("Test", testSchema);
module.exports = Test;
