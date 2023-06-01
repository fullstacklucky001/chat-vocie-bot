import express from "express";

import { init, getTTS } from "../controllers/fakeYouController.js";
const router = express.Router();

router.post("/tts_init", init);
router.post("/get_tts", getTTS);

export default router;
