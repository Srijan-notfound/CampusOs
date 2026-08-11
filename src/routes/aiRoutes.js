const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { chat } = require("../controllers/aiController");

router.post("/chat", authMiddleware, chat);

module.exports = router;