const express = require("express")
const { login } = require("../controllers/authController.js")
const { init, getTTS } = require("../controllers/fakeYouController.js")
const {
    insertUserMessage,
    insertRickMessage,
    insertRickStaticMessage,
    getMessages,
    deleteMessage,
    getPrompts,
    activePrompt,
    updatePrompt,
} = require("../controllers/chatGptController.js")

const { updateSchedule, getSchedules, activeSchedule } = require("../controllers/scheduleController.js")


const router = express.Router();

router.post("/login", login);
router.post("/tts_init", init);
router.post("/get_tts", getTTS);
router.post("/insert_user_message", insertUserMessage);
router.post("/insert_rick_message", insertRickMessage);
router.post("/insert_rick_static_message", insertRickStaticMessage);
router.post("/delete_message", deleteMessage);
router.get("/get_messages", getMessages);

// prompts
router.get("/get_prompts", getPrompts);
router.post("/active_prompt", activePrompt);
router.post("/update_prompt", updatePrompt);

// schedules
router.get("/get_schedules", getSchedules);
router.post("/active_schedule", activeSchedule);
router.post("/update_schedule", updateSchedule);

module.exports = router;