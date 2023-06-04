import { PUSH_MESSAGE, FETCH_MESSAGES, DELETE_MESSAGE } from '../actions/config';

const initialState = {
    messages: [],
};

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case PUSH_MESSAGE:
            return {
                messages: [...state.messages, action.payload]
            }
        case FETCH_MESSAGES: {
            return {
                messages: action.payload.data
            }
        }
        case DELETE_MESSAGE: {
            return {
                messages: state.messages.filter((message) => message._id !== action.payload)
            };
        }
        default:
            return state;
    }
}

export default messageReducer;