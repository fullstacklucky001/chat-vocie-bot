import { PUSH_MESSAGE, FETCH_MESSAGES } from '../actions/config';

// const initialState = {
//     id: 0,
//     type: 0,
//     message: '',
// };

const initialState = []

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case PUSH_MESSAGE:
            return [
                ...state,
                action.payload
            ]
        // case SIGNUP:
        // case LOAD_USER:
        //     setAuthToken(action?.payload?.token);
        //     return {
        //         ...state,
        //         isAuthenticated: true,
        //         loading: false,
        //         user: action?.payload?.user,
        //         token: action?.payload?.token
        //     }
        // case SIGNOUT:
        //     setAuthToken(null);
        //     return {
        //         ...state,
        //         isAuthenticated: false,
        //         loading: false,
        //         user: null,
        //         token: null
        //     }
        default:
            return state;
    }
}

export default messageReducer;