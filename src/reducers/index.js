import { combineReducers } from 'redux';

import messageReducer from './messageReducer'

const rootReducer = combineReducers({
    messageObj: messageReducer,
})

export default rootReducer;