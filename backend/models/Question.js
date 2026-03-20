const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    optionA: { type: String, required: true, trim: true },
    optionB: { type: String, required: true, trim: true },
    optionC: { type: String, required: true, trim: true },
    optionD: { type: String, required: true, trim: true },
    correctAnswer: {
      type: String,
      required: true,
      enum: ["A", "B", "C", "D"],
    },
    exam: {
      type: String,
      required: true,
      enum: ["NET", "SET", "NIMCET", "ASSISTANT_PROFESSOR", "MPPSC", "OTHER"],
      default: "OTHER",
    },
    subject: {
      type: String,
      required: true,
      enum: ["maths", "reasoning", "computer", "english", "aptitude"],
      default: "maths",
    },
  },
  { timestamps: true }
);

// Create compound index for exam and subject
questionSchema.index({ exam: 1, subject: 1 });

module.exports = mongoose.model("Question", questionSchema);
