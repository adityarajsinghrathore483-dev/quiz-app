const express = require("express");
const { login, getResults } = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.get("/results/:userId", getResults);

module.exports = router;
