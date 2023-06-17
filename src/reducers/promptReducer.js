import { UPDATE_PROMPT, FETCH_PROMPTS } from '../actions/config';

const initialState = {
    prompts: [],
};

const promptReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_PROMPT:
            return {
                prompts: state.prompts.map(prompt =>
                    prompt._id === action.payload._id ? action.payload : prompt)
            }
        case FETCH_PROMPTS: {
            return {
                prompts: action.payload.data
            }
        }
        default:
            return state;
    }
}

export default promptReducer;