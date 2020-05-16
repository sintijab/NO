import { combineReducers } from 'redux'
import signReducer from './signReducer'
import postReducer from './postReducer'
import pagesReducer from './pagesReducer'
import fieldsReducer from './fieldsReducer'
import soundsReducer from './soundsReducer'

const rootReducer = combineReducers({
  signInStatus: signReducer,
  postsData: postReducer,
  pagesData: pagesReducer,
  fieldsData: fieldsReducer,
  musicData: soundsReducer,
})

const initialState = rootReducer({}, {})

export default (state = initialState, action) => rootReducer(state, action)
