import { FETCH_SCHEDULES, UPDATE_SCHEDULE, ADD_SCHEDULE } from './config';

export const fetchSchedules = (payload) => ({
    type: FETCH_SCHEDULES,
    payload
});

export const updateSchedule = (payload) => ({
    type: UPDATE_SCHEDULE,
    payload
});

export const addSchedule = (payload) => ({
    type: ADD_SCHEDULE,
    payload
});