const mongoose = require("mongoose")

const MessageSchema = mongoose.Schema({
    owner: {
        type: Number    // 1: user , 0: rick
    },
    seed: {
        type: Boolean
    },
    message: {
        type: Object
    },
}, {
    timestamps: true
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;

