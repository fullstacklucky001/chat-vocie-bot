import { PUSH_MESSAGE } from './config';

export const pushMessage = (payload) => ({
    type: PUSH_MESSAGE,
    payload
});