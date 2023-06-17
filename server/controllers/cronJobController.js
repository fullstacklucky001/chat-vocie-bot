const cron = require('node-cron');

let io;
let startTask;
let endTask;
const startAt_M = 1;
const startAt_H = 1;
let endM = 1;
let endH = 1;

const cronJob = (props) => {
    if (props?.io) {
        io = props?.io;
    }

    const timing = props?.timing;
    let scheduleExpression = `0 ${startAt_M} ${startAt_H} * * *`

    if (timing) {
        if (startTask) {
            const startM = timing.startM;
            const startH = timing.startH;

            endM = timing.endM;
            endH = timing.endH

            scheduleExpression = `0 ${startM} ${startH} * * *`;
            startTask.stop();
            endTask.stop()
        }
    }

    let alarmStart = {
        status: 'start',
        schedule: props.alarm
    }

    startTask = cron.schedule(scheduleExpression, () => {
        io.emit('receive_message', alarmStart)
    }, {
        scheduled: true,
    });
    startTask.start()

    let alarmEnd = {
        status: 'end',
        schedule: props.alarm
    }
    scheduleExpression = `0 ${endM} ${endH} * * *`
    endTask = cron.schedule(scheduleExpression, () => {
        io.emit('receive_message', alarmEnd)
    }, {
        scheduled: true,
    });
    endTask.start()
}

module.exports = {
    cronJob
}