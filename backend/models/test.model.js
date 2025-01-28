const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    testName: {
      type: String,
      required: true,
      trim: true,
    },
    testDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      match: /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/,
    },
    endTime: {
      type: String,
      required: true,
      match: /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/,
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
