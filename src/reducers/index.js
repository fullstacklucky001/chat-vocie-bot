import { combineReducers } from 'redux';

import messageReducer from './messageReducer'
import promptReducer from './promptReducer'
import scheduleReducer from './scheduleReducer'

const rootReducer = combineReducers({
    messageObj: messageReducer,
    promptObj: promptReducer,
    scheduleObj: scheduleReducer
})

export default rootReducer;