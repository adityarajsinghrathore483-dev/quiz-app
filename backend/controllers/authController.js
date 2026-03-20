const User = require("../models/User");

const login = async (req, res, next) => {
  try {
    const { name, email, mobile } = req.body;
    if (!name || !email || !mobile) {
      return res.status(400).json({ message: "Name, email, and mobile are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedMobile = mobile.trim();

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        mobile: normalizedMobile,
      });
    } else {
      // Update name/mobile if changed
      const updated = {};
      if (user.name !== name.trim()) updated.name = name.trim();
      if (user.mobile !== normalizedMobile) updated.mobile = normalizedMobile;
      if (Object.keys(updated).length) {
        user = await User.findByIdAndUpdate(user._id, updated, { new: true });
      }
    }

    return res.json({
      user: {
        _id: user._id.toString(),
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

const getResults = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User id is required." });
    }

    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({ user });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, getResults };
