const mongoose = require("mongoose")

const PromptSchema = mongoose.Schema({
    title: {
        type: String
    },
    prompt: {
        type: String
    },
    summarized_prompt: {
        type: String
    },
    seed: {
        type: Boolean // true: system_content(Not allowed update), false: allow user update 
    },
    active: {
        type: Boolean // false: inactive, true: active
    }
}, {
    timestamps: true
});

const Prompt = mongoose.model('Prompt', PromptSchema);

module.exports = Prompt;

