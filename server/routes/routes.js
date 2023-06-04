const express = require("express")
const { login } = require("../controllers/authController.js")
const { init, getTTS } = require("../controllers/fakeYouController.js")
const { insertUserMessage, insertRickMessage, getMessages, deleteMessage } = require("../controllers/chatGptController.js")

const router = express.Router();

router.post("/login", login);
router.post("/tts_init", init);
router.post("/get_tts", getTTS);
router.post("/insert_user_message", insertUserMessage);
router.post("/insert_rick_message", insertRickMessage);
router.post("/delete_message", deleteMessage);
router.get("/get_messages", getMessages);

module.exports = router;