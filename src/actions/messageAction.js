import { PUSH_MESSAGE, FETCH_MESSAGES } from './config';

export const fetchMessages = (payload) => ({
    type: FETCH_MESSAGES,
    payload
});

export const pushMessage = (payload) => ({
    type: PUSH_MESSAGE,
    payload
});