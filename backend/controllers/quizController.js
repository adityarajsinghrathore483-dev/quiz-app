const Question = require("../models/Question");
const User = require("../models/User");

const getQuestions = async (req, res, next) => {
  try {
    const { exam, subject } = req.query;

    // If exam and subject are provided, fetch questions for that exam/subject combination
    if (exam && subject) {
      const questions = await Question.find(
        { exam, subject },
        { correctAnswer: 0, createdAt: 0, updatedAt: 0 }
      )
        .limit(20)
        .lean();
      return res.json({ questions });
    }

    // Otherwise, fetch all questions (for backward compatibility)
    const questions = await Question.find({}, { correctAnswer: 0, createdAt: 0, updatedAt: 0 }).lean();
    return res.json({ questions });
  } catch (err) {
    next(err);
  }
};

const submit = async (req, res, next) => {
  try {
    const { userId, answers, exam, subject } = req.body;

    if (!userId || !answers || typeof answers !== "object") {
      return res.status(400).json({ message: "userId and answers are required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const questionIds = Object.keys(answers);
    const query = { _id: { $in: questionIds } };

    // If exam and subject are provided, use them to fetch questions
    if (exam && subject) {
      query.exam = exam;
      query.subject = subject;
    }

    const questionDocs = await Question.find(query).lean();

    // Get total number of questions available for this topic
    let totalQuestions = 20;
    if (exam && subject) {
      totalQuestions = await Question.countDocuments({ exam, subject });
    } else {
      totalQuestions = await Question.countDocuments();
    }

    let correct = 0;
    questionDocs.forEach((q) => {
      const key = q._id.toString();
      const answer = answers[key];
      const expected = String(q.correctAnswer).toUpperCase();
      if (answer && answer.toUpperCase() === expected) {
        correct += 1;
      }
    });

    const wrong = questionDocs.length - correct;
    const percentage = questionDocs.length > 0 ? Math.round((correct / questionDocs.length) * 100) : 0;

    user.score = correct;
    user.questionsAttempted = questionDocs.length;
    user.completedAt = new Date();
    user.totalQuestions = totalQuestions;
    await user.save();

    return res.json({
      result: {
        attempted: questionDocs.length,
        correct,
        wrong,
        total: totalQuestions,
        percentage,
      },
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        score: user.score,
        questionsAttempted: user.questionsAttempted,
        totalQuestions: user.totalQuestions,
        completedAt: user.completedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getResults = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        score: user.score || 0,
        questionsAttempted: user.questionsAttempted || 0,
        totalQuestions: user.totalQuestions || 0,
        completedAt: user.completedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getQuestions, submit, getResults };
