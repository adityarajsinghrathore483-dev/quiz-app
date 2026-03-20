const express = require("express");









const { getQuestions, submit, getResults } = require("../controllers/quizController");

const router = express.Router();

router.get("/questions", getQuestions);
router.post("/submit", submit);
router.get("/results/:id", getResults);

module.exports = router;
