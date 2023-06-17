import { FETCH_PROMPTS, UPDATE_PROMPT } from './config';

export const fetchPrompts = (payload) => ({
    type: FETCH_PROMPTS,
    payload
});

export const updatePrompt = (payload) => ({
    type: UPDATE_PROMPT,
    payload
});