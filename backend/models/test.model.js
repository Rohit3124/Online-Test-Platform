const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    testname: {
      type: String,
      required: true,
      trim: true,
    },
    testdate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    totalmarks: {
      type: Number,
      required: true,
    },
    questions: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const Test = mongoose.model("Test", testSchema);
module.exports = Test;
