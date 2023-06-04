import { PUSH_MESSAGE, FETCH_MESSAGES, DELETE_MESSAGE } from './config';

export const pushMessage = (payload) => ({
    type: PUSH_MESSAGE,
    payload
});

export const fetchMessages = (payload) => ({
    type: FETCH_MESSAGES,
    payload
});

export const deleteMessage = (payload) => ({
    type: DELETE_MESSAGE,
    payload
});