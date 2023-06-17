const mongoose = require("mongoose")

const ScheduleSchema = mongoose.Schema({
    title: {
        type: String
    },
    startAt: {
        type: Date
    },
    startAt_H: {
        type: Number
    },
    startAt_M: {
        type: Number
    },
    duration: {
        type: Number
    },
    message: {
        type: String
    },
    active: {
        type: Boolean // false: inactive, true: active
    },
}, {
    timestamps: true
});

const Schedule = mongoose.model('Schedule', ScheduleSchema);

module.exports = Schedule;

