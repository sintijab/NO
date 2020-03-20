import { combineReducers } from 'redux'
import signReducer from './signReducer'

const rootReducer = combineReducers({
  signInStatus: signReducer,
})

const initialState = rootReducer({}, {})

export default (state = initialState, action) => rootReducer(state, action)
