const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    testname: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    totalmarks: {
      type: Number,
      required: true,
    },
    examdate: {
      type: Date,
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
