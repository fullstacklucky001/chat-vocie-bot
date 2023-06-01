import express from "express";
import { login } from "../controllers/authController.js"
import { init, getTTS } from "../controllers/fakeYouController.js"
import { makeMessage } from "../controllers/chatGptController.js"

const router = express.Router();

router.post("/login", login);
router.post("/tts_init", init);
router.post("/get_tts", getTTS);
router.post("/make_message", makeMessage)

export default router;
