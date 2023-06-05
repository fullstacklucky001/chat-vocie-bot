const mongoose = require("mongoose")

const PromptSchema = mongoose.Schema({
    title: {
        type: String    // 1: user , 0: rick
    },
    prompt: {
        type: String
    },
    maxLength: {
        type: Number
    },
    active: {
        type: Number
    }
}, {
    timestamps: true
});

const Prompt = mongoose.model('Prompt', PromptSchema);

module.exports = Prompt;

