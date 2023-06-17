import { UPDATE_SCHEDULE, FETCH_SCHEDULES } from '../actions/config';

const initialState = {
    schedules: [],
};

const scheduleReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_SCHEDULE:
            return {
                schedules: state.schedules.map(schedule =>
                    schedule._id === action.payload._id ? action.payload : schedule)
            }
        case FETCH_SCHEDULES: {
            return {
                schedules: action.payload.data
            }
        }
        default:
            return state;
    }
}

export default scheduleReducer;