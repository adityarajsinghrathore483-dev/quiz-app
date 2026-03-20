const mongoose = require("mongoose");
const Question = require("../models/Question");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/quiz-app");
    const exams = await Question.distinct("exam");
    const subjects = await Question.distinct("subject");
    const combo = await Question.aggregate([
      { $group: { _id: { exam: "$exam", subject: "$subject" }, count: { $sum: 1 } } },
      { $sort: { "_id.exam": 1, "_id.subject": 1 } },
    ]);

    console.log("exams", exams);
    console.log("subjects", subjects);
    console.log("combo first 20", combo.slice(0, 20));
    console.log("total", await Question.countDocuments());
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
